import { SINVAPI } from '../api';
import { SINVUserSystem } from './users';

SINVAPI.addAction('auth/login', {
    needsAuthentication: false,
    needsPermissions: [],
    requiresDataFields: ['username', 'password'],
    actionHandler: async (data) => {
        let user = new SINVUserSystem.User({ username: data.username });
        if (await user.checkPassword(data.password)) {
            let sessionID = user.createSession();
            return { success: true, data: { sessionID } };
        } else {
            return { success: false, error: 'wrong_password' };
        }
    },
});

SINVAPI.addAction('helloWorld', {
    needsAuthentication: false,
    needsPermissions: [],
    requiresDataFields: [],
    actionHandler: async (data) => {
        console.log(`API data: ${JSON.stringify(data)}`);
        return {
            success: true,
            data: {
                hello: 'world',
            },
        };
    },
});
