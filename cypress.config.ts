//@ts-nocheck
import { defineConfig } from 'cypress';
import { SINVUserSystem } from './backend/lib/auth/users';
import { SINVConfig } from './backend/lib/config';
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
