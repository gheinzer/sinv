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
            });
        },
    },
});
