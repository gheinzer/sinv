import { defineConfig } from 'cypress';
import { SINVConfig } from './backend/lib/config';

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            on('task', {
                getConfig() {
                    return SINVConfig.config;
                },
            });
        },
    },
});
