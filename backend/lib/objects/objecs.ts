import {
    Attachment as DBAttachment,
    ObjectType as DBObjectType,
    Object as DBObject,
    User as DBUser,
    PrismaClient,
} from '@prisma/client';
import { SINVUserSystem } from '../auth/users';
import { SINVConfig } from '../config';
import { InitializableClass } from '../types';
import { SINVRepositories } from './repositories';

namespace SINVObjects {
    const prisma = SINVConfig.getPrismaClient();

    export async function addObject(data: {
        objectID: string;
        creator: SINVUserSystem.User;
        objectType: DBObjectType;
        repository: SINVRepositories.Repository;
        description: string;
    }) {
        await data.creator.awaitInitialization();
        await data.repository.awaitInitialization();
        if (
            await prisma.object.findFirst({
                where: {
                    userDefinedID: data.objectID,
                    repositoryId: data.repository.repositoryRow.id,
                },
            })
        ) {
            throw Error('object_id_already_in_use');
        }
        await prisma.object.create({
            data: {
                userDefinedID: data.objectID,
                creatorID: data.creator.userRow.id,
                objectTypeId: data.objectType.id,
                repositoryId: data.repository.repositoryRow.id,
                description: data.description,
            },
        });
    }

    class SINVObject extends InitializableClass {
        // ! These variables are initialized in the asynchronous init method and awaitInitialization() must be called before accessing them.
        public objectRow!: DBObject;
        public objectRepository!: SINVRepositories.Repository;

        constructor(public objectID: number) {
            super();
            this.init();
        }

        private async init() {
            this.objectRow = await prisma.object.findUniqueOrThrow({
                where: { id: this.objectID },
            });
            if (!this.objectRow.repositoryId) throw Error();
            this.objectRepository = new SINVRepositories.Repository(
                this.objectRow.repositoryId
            );
            await this.objectRepository.awaitInitialization();
            this.markAsInitialized();
        }
    }
}
