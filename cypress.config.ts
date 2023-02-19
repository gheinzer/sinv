import { defineConfig } from 'cypress';
import { SINVConfig } from './backend/lib/config';

SINVConfig.overrideConfig = {
    httpd: {},
    prismaClientOptions: {
        datasources: {
            db: {
                url: `file:${__dirname}/data/sinv.db`,
            },
        },
    },
};
SINVConfig.readConfig();

import { SINVUserSystem } from './backend/lib/auth/users';
import { SINVRepositories } from './backend/lib/objects/repositories';

let sessionIDs: { [key: string]: string } = {};

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            on('task', {
                getConfig() {
                    return SINVConfig.config;
                },
                async openSession(username: string) {
                    if (sessionIDs[username]) return sessionIDs[username];
                    let user = new SINVUserSystem.User({
                        username: username,
                    });
                    return await user.createSession();
                },

                async createRepositoryIfNotExists(name: string) {
                    if (!(await SINVRepositories.repositoryExists(name)))
                        await SINVRepositories.createRepository(name, '');
                    return null;
                },

                async createTestingRepository() {
                    try {
                        let oldRepo =
                            await SINVRepositories.getRepositoryByName(
                                'testingRepository'
                            );
                        await oldRepo.delete();
                    } catch {}
                    let repoID = await SINVRepositories.createRepository(
                        'testingRepository',
                        'This is a repository created automatically when running the cypress tests. After running the test, feel free to delete it.'
                    );
                    let repo = await SINVRepositories.getRepository(repoID);
                    await repo.createType('category0');
                    await repo.createType('category1');
                    await repo.createAttachmentType('category2');
                    await repo.createAttachmentType('category3');

                    return null;
                },
            });
        },
    },
});
