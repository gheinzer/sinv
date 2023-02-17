import {
    PrismaClient,
    User as DBUser,
    UserSession as DBUserSession,
} from '@prisma/client';
import { SINVPermissions } from './permissions';
import * as bcrypt from 'bcrypt';
import { SINVConfig } from '../config';
import { permissionObject, permission } from './permissions.types';
import * as crypto from 'crypto';
import { InitializableClass } from '../types';
import { SINVRepositories } from '../objects/repositories';

export namespace SINVUserSystem {
    const prisma = SINVConfig.getPrismaClient();

    export interface identificationObject {
        sessionID?: string;
        username?: string;
        userID?: number;
    }

    /**
     * Creates the admin user if it does not already exist. The default password used is `admin`.
     *
     * @export
     * @async
     * @returns {*}
     */
    export async function initializeAdminUser() {
        try {
            await createUser(
                'admin',
                'admin',
                SINVPermissions.permissionStringToObject('{"superuser": true}')
            );
        } catch {}
    }

    /**
     * Determines if a user with a given username exists.
     *
     * @export
     * @async
     * @param {string} username The username of the user to check.
     * @returns {Promise<boolean>}
     */
    export async function userExists(username: string): Promise<boolean> {
        let users = await prisma.user.findFirst({ where: { username } });
        return users !== null; // findFirst returns null if the record is not found
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
        password: string,
        permissions: permissionObject = SINVPermissions.permissionStringToObject(
            '{}'
        )
    ): Promise<User> {
        if (await prisma.user.findUnique({ where: { username: username } })) {
            throw Error('user_already_exists');
        }
        let passwordHash = bcrypt.hashSync(
            password,
            SINVConfig.config.users.password_hash_rounds
        );
        let permissionString =
            SINVPermissions.permissionObjectToString(permissions);
        await prisma.user.create({
            data: {
                username,
                passwordHash,
                permissionString: permissionString,
            },
        });
        return new User({ username });
    }

    export async function getAllUsers(): Promise<DBUser[]> {
        return await prisma.user.findMany();
    }

    export class User extends InitializableClass {
        public userRow!: DBUser; // This variable is assigned in the init method called by the constructor.
        private permissionObject!: permissionObject;
        public username!: string;

        /**
         * Creates an user object and initializes it.
         * @param {SINVUserSystem.identificationObject} identification The identification property that is used to get the user row from the database.
         * @example
         * new SINVUserSystem.User({username: 'foo'})
         */
        constructor(private identification: identificationObject) {
            super();
            this.init();
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
                        await prisma.userSession.findUnique({
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
                this.initializationError = 'user_identification_not_defined';
                return;
            }
            if (row) {
                this.userRow = row;
                this.permissionObject =
                    SINVPermissions.permissionStringToObject(
                        this.userRow.permissionString
                    );
                this.markAsInitialized();
            } else {
                this.initializationError = 'user_not_found';
                return;
            }
            this.username = this.userRow.username;
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
            await prisma.userSession.create({
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

        /**
         * Generates an array of the repositories the user has permission to access.
         *
         * @public
         * @async
         * @returns {Promise<
                    SINVRepositories.Repository[]
                >}
         */
        public async getUserRepositories(): Promise<
            SINVRepositories.Repository[]
        > {
            this.awaitInitialization();
            let repositories: SINVRepositories.Repository[] = [];
            if (await this.hasPermission('repositoryAdmin')) {
                let repositoryList = await prisma.repository.findMany({
                    where: {},
                });
                for (let repo of repositoryList) {
                    let repositoryObject = new SINVRepositories.Repository(
                        repo.id
                    );
                    await repositoryObject.awaitInitialization();
                    repositories.push(repositoryObject);
                }
            } else {
                let user = await prisma.user.findUniqueOrThrow({
                    where: { id: this.userRow.id },
                    include: { repositoryPermissions: true },
                });
                for (let permission of user.repositoryPermissions) {
                    if (!permission.repositoryId) continue;
                    let repositoryObject = new SINVRepositories.Repository(
                        permission.repositoryId
                    );
                    await repositoryObject.awaitInitialization();
                    repositories.push(repositoryObject);
                }
            }
            return repositories;
        }
    }

    /**
     * Validates a session with a given session ID based on existance and age.
     * Returns `true` if the session is valid and `false` if the session is invalid.
     *
     * @export
     * @async
     * @param {string} sessionID The session ID to validate.
     * @returns {Promise<boolean>}
     */
    export async function validateSession(sessionID: string): Promise<boolean> {
        let session = await prisma.userSession.findUnique({
            where: { id: sessionID },
        });
        if (session == null || !session.opened) return false;
        return checkSessionAge(session.opened);
    }

    /**
     * Checks if a session is older than the max age set in the config. Returns `true` if the session is not too old, returns `false` if it is too old.
     *
     * @async
     * @param {Date} date The creation time and date of the session.
     * @returns {Promise<boolean>}
     */
    async function checkSessionAge(date: Date): Promise<boolean> {
        let age = Date.now() - date.getTime();
        age = age / (1000 * 60 * 60); // Converts the session age to hours.
        return age < SINVConfig.config.users.sessionMaxAge;
    }

    export async function destroySession(sessionID: string) {
        await prisma.userSession.delete({ where: { id: sessionID } });
    }
}
