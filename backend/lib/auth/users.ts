import {
    PrismaClient,
    User as DBUser,
    UserSessions as DBUserSession,
} from '@prisma/client';
import { SINVPermissions } from './permissions';
import * as bcrypt from 'bcrypt';
import { SINVConfig } from '../config';
import { permissionObject, permission } from './permissions.types';

export namespace SINVUserSystem {
    const prisma = new PrismaClient();

    export interface identificationObject {
        sessionID?: string;
        username?: string;
        userID?: number;
    }

    /**
     * Creates a new user with the given username and password.
     *
     * @export
     * @async
     * @param {string} username
     * @param {string} password
     * @returns {Promise<User>}
     *
     * @throws {'user_already_exist'} Thrown if the username you have given is already in used and can't be used again.
     */
    export async function createUser(
        username: string,
        password: string
    ): Promise<User> {
        if (await prisma.user.findUnique({ where: { username: username } })) {
            throw Error('user_already_exists');
        }
        let passwordHash = bcrypt.hashSync(
            password,
            SINVConfig.config.users.password_hash_rounds
        );
        await prisma.user.create({ data: { username, passwordHash } });
        return new User({ username });
    }

    export class User {
        private userRow!: DBUser; // This variable is assigned in the init method called by the constructor.
        private permissionObject!: permissionObject;
        private isInitialized: boolean = false;
        private initCallbacks: (() => void)[] = [];

        /**
         * Creates an user object and initializes it.
         * @param {SINVUserSystem.identificationObject} identification The identification property that is used to get the user row from the database.
         * @example
         * new SINVUserSystem.User({username: 'foo'})
         */
        constructor(private identification: identificationObject) {
            this.init();
        }

        private awaitInitialization() {
            if (this.isInitialized) return;
            return new Promise<void>((resolve, reject) => {
                this.initCallbacks.push(resolve);
            });
        }

        /**
         * Initializes the user with the database row.
         *
         * @private
         * @async
         * @returns {*}
         *
         * @throws {user_identification_not_defined} Thrown when no identification values are given.
         * @throws {user_not_found} Thrown no user is found that matches the identification values.
         */
        private async init() {
            let row: DBUser | null | undefined;
            if (this.identification.sessionID) {
                row =
                    (
                        await prisma.userSessions.findUnique({
                            where: { id: this.identification.sessionID },
                            include: { User: true },
                        })
                    )?.User ?? undefined;
            } else if (this.identification.username) {
                row =
                    (await prisma.user.findUnique({
                        where: { username: this.identification.username },
                    })) ?? undefined;
            } else if (this.identification.userID) {
                row =
                    (await prisma.user.findUnique({
                        where: { id: this.identification.userID },
                    })) ?? undefined;
            } else {
                throw Error('user_identification_not_defined');
            }
            if (row) {
                this.userRow = row;
                this.permissionObject =
                    SINVPermissions.permissionStringToObject(
                        this.userRow.permissionString
                    );
                this.isInitialized = true;
                for (let callback of this.initCallbacks) {
                    callback();
                }
            } else throw Error('user_not_found');
        }

        /**
         * Determines if a user has a permission.
         * @param {SINVPermissions.permission} permission The name of the permission.
         * @returns {Promise<boolean>}
         *
         * @async
         */
        public async hasPermission(permission: permission): Promise<boolean> {
            await this.awaitInitialization();
            let permissionObject = SINVPermissions.permissionStringToObject(
                this.userRow.permissionString
            );
            return SINVPermissions.hasPermission(
                this.permissionObject,
                permission
            );
        }

        /**
         * Generates a session ID and associates it with the user.
         *
         * @public
         * @async
         * @returns {Promise<string>}
         */
        public async createSession(): Promise<string> {
            await this.awaitInitialization();
            let sessionID = crypto.randomUUID();
            prisma.userSessions.create({
                data: {
                    userId: this.userRow.id,
                    id: sessionID,
                },
            });
            return sessionID;
        }

        /**
         * Checks if the given password is right for the user.
         *
         * @public
         * @async
         * @param {string} password
         * @returns {Promise<boolean>}
         */
        public async checkPassword(password: string): Promise<boolean> {
            await this.awaitInitialization();
            return bcrypt.compareSync(password, this.userRow.passwordHash);
        }
    }
}
