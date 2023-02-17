//@ts-nocheck
import { defineConfig } from 'cypress';
import { SINVUserSystem } from './backend/lib/auth/users';
import { SINVConfig } from './backend/lib/config';

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
            });
        },
    },
});
