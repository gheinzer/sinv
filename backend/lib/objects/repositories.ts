import { InitializableClass } from '../types';
import {
    PrismaClient,
    User as DBUser,
    Repository as DBRepository,
} from '@prisma/client';
import { SINVUserSystem } from '../auth/users';
import { SINVConfig } from '../config';
import {
    AttachmentData,
    AttachmentProperties,
    ObjectProperties,
} from './repositories.types';
import { SINVUploads } from '../http/uploads';
export namespace SINVRepositories {
    const prisma = SINVConfig.getPrismaClient();

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

    export async function getRepository(id: number): Promise<Repository> {
        await prisma.repository.findUniqueOrThrow({ where: { id } });
        return new Repository(id);
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
            if (await user.hasPermission('repositoryAdmin')) return true; // With this permission, the user has access to all repositories.
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

        public async getTypes() {
            await this.awaitInitialization();
            return await prisma.objectType.findMany({
                where: {
                    repositoryId: this.repositoryID,
                },
                select: {
                    id: true,
                    name: true,
                },
            });
        }
        public async getAttachmentTypes() {
            await this.awaitInitialization();
            return await prisma.attachmentType.findMany({
                where: {
                    repositoryId: this.repositoryID,
                },
                select: {
                    id: true,
                    name: true,
                },
            });
        }

        public async userHasPermissionOrThrow(
            userInfo: SINVUserSystem.identificationObject
        ) {
            let user = new SINVUserSystem.User(userInfo);
            if (!(await this.userHasPermission(user)))
                throw Error('repository_permission_denied');
        }

        public async changeTypeName(id: number, name: string) {
            await this.awaitInitialization();
            let types = await prisma.objectType.findFirst({
                where: { id, repositoryId: this.repositoryID },
            });
            if (types == null) throw Error('type_not_in_this_repository');
            await prisma.objectType.update({
                where: { id },
                data: {
                    name,
                },
            });
        }

        public async deleteType(id: number) {
            await this.awaitInitialization();
            let types = await prisma.objectType.findFirst({
                where: { id, repositoryId: this.repositoryID },
            });
            if (types == null) throw Error('type_not_in_this_repository');
            await prisma.objectType.delete({ where: { id } });
        }

        public async createType(name: string) {
            await this.awaitInitialization();
            await prisma.objectType.create({
                data: {
                    name,
                    repositoryId: this.repositoryID,
                },
            });
        }

        public async changeAttachmentTypeName(id: number, name: string) {
            await this.awaitInitialization();
            let types = await prisma.attachmentType.findFirst({
                where: { id, repositoryId: this.repositoryID },
            });
            if (types == null) throw Error('type_not_in_this_repository');
            await prisma.attachmentType.update({
                where: { id },
                data: {
                    name,
                },
            });
        }

        public async deleteAttachmentType(id: number) {
            await this.awaitInitialization();
            let types = await prisma.attachmentType.findFirst({
                where: { id, repositoryId: this.repositoryID },
            });
            if (types == null) throw Error('type_not_in_this_repository');
            await prisma.attachmentType.delete({ where: { id } });
        }

        public async createAttachmentType(name: string) {
            await this.awaitInitialization();
            await prisma.attachmentType.create({
                data: {
                    name,
                    repositoryId: this.repositoryID,
                },
            });
        }

        public async createObject(
            identifier: string,
            name: string,
            typeID: number,
            description: string,
            attachments: AttachmentData[],
            creator: SINVUserSystem.User
        ) {
            await this.awaitInitialization();
            await creator.awaitInitialization();
            if (await this.identifierExists(identifier))
                throw Error('identifier_already_used');
            let newObject = await prisma.object.create({
                data: {
                    userDefinedID: identifier,
                    name,
                    objectTypeId: typeID,
                    description,
                    creatorID: creator.userRow.id,
                    repositoryId: this.repositoryID,
                },
            });
            for (let attachment of attachments) {
                let attachmentRow = await prisma.attachment.create({
                    data: {
                        comment: attachment.name,
                        mimeType: attachment.mimeType,
                        attachmentTypeId: parseInt(
                            attachment.attachmentCategory
                        ),
                        objectId: newObject.id,
                        fileExtension: attachment.fileExtension,
                    },
                });
                SINVUploads.moveAttachmentFile(
                    attachment.uploadID,
                    attachmentRow.id
                );
            }
        }

        public async identifierExists(identifier: string) {
            await this.awaitInitialization();
            let objects = await prisma.object.findFirst({
                where: {
                    userDefinedID: identifier,
                    repositoryId: this.repositoryID,
                },
            });
            return objects !== null;
        }

        public async getObjectProperties(
            objectIdentifier: string
        ): Promise<ObjectProperties> {
            await this.awaitInitialization();
            let objectRow = await prisma.object.findFirstOrThrow({
                where: {
                    userDefinedID: objectIdentifier,
                    repositoryId: this.repositoryID,
                },
                include: {
                    attachments: {
                        include: {
                            AttachmentType: true,
                        },
                    },
                    ObjectType: true,
                },
            });
            let attachmentProperties: AttachmentProperties[] = [];
            for (let attachment of objectRow.attachments) {
                attachmentProperties.push({
                    attachmentID: attachment.id,
                    categoryID: attachment.attachmentTypeId,
                    categoryName: attachment.AttachmentType.name,
                    extension: attachment.fileExtension,
                    name: attachment.comment,
                });
            }
            return {
                attachments: attachmentProperties,
                categoryID: objectRow.objectTypeId,
                categoryName: objectRow.ObjectType.name,
                description: objectRow.description,
                identifier: objectRow.userDefinedID,
                name: objectRow.name,
                id: objectRow.id,
            };
        }
    }
}
