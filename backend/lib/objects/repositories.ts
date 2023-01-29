import { InitializableClass } from '../types';
import {
    PrismaClient,
    User as DBUser,
    Repository as DBRepository,
} from '@prisma/client';
import { SINVUserSystem } from '../auth/users';
export namespace SINVRepositories {
    const prisma = new PrismaClient();

    export async function createRepository(
        name: string,
        owner: DBUser,
        description: string
    ) {
        await prisma.repository.create({
            data: {
                name,
                description,
            },
        });
        let repositoryRow = await prisma.repository.findUniqueOrThrow({
            where: {
                name,
            },
        });
        await prisma.repositoryPermission.create({
            data: { userId: owner.id, repositoryId: repositoryRow.id },
        });
    }

    export class Repository extends InitializableClass {
        public repositoryRow!: DBRepository;

        constructor(private repositoryID: number) {
            super();
            this.init();
        }

        private async init() {
            this.repositoryRow = await prisma.repository.findUniqueOrThrow({
                where: {
                    id: this.repositoryID,
                },
            });
            this.markAsInitialized();
        }

        /**
         * Evaluates if a user has permission to access the repository.
         *
         * @public
         * @async
         * @param {SINVUserSystem.User} user
         * @returns {unknown}
         */
        public async userHasPermission(user: SINVUserSystem.User) {
            await this.awaitInitialization();
            let permissions = await prisma.repositoryPermission.findFirst({
                where: {
                    userId: user.userRow.id,
                    repositoryId: this.repositoryID,
                },
            });
            return permissions !== null;
        }

        public async search(searchString: string) {
            await this.awaitInitialization();
            let results = await prisma.object.findMany({
                where: {
                    repositoryId: this.repositoryID,
                    OR: [
                        {
                            userDefinedID: {
                                contains: searchString,
                            },
                        },
                        {
                            attachments: {
                                some: {
                                    comment: {
                                        contains: searchString,
                                    },
                                },
                            },
                        },
                        {
                            description: {
                                contains: searchString,
                            },
                        },
                    ],
                },
                orderBy: {
                    lastAccessed: 'desc',
                },
            });
            return results;
        }
    }
}
