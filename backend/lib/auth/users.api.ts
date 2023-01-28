import { SINVAPI } from '../api/api';
import { SINVUserSystem } from './users';

SINVAPI.addAction('auth/login', {
    needsAuthentication: false,
    needsPermissions: [],
    requiresDataFields: ['username', 'password'],
    actionHandler: async (data) => {
        let user = new SINVUserSystem.User({ username: data.username });
        if (await user.checkPassword(data.password)) {
            let sessionID = await user.createSession();
            return { success: true, data: { sessionID } };
        } else {
            return { success: false, error: 'wrong_password' };
        }
    },
});

SINVAPI.addAction('auth/userExists', {
    needsAuthentication: false,
    needsPermissions: [],
    requiresDataFields: ['username'],
    actionHandler: async (data) => {
        return {
            success: true,
            data: {
                userExists: await SINVUserSystem.userExists(data.username),
            },
        };
    },
});
SINVAPI.addAction('auth/validateSession', {
    needsAuthentication: false,
    needsPermissions: [],
    requiresDataFields: ['sessionID'],
    actionHandler: async (data) => {
        return {
            success: true,
            data: {
                isValid: await SINVUserSystem.validateSession(data.sessionID),
            },
        };
    },
});
