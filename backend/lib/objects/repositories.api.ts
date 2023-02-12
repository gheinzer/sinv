import { SINVAPI } from '../api/api';
import { SINVUserSystem } from '../auth/users';
import { SINVRepositories } from './repositories';

SINVAPI.addAction('repo/getRepositories', {
    needsAuthentication: true,
    needsPermissions: [],
    requiresDataFields: [],
    actionHandler: async (data, auth) => {
        let user = new SINVUserSystem.User({ sessionID: auth.sessionID });
        let permittedRepositories = await user.getUserRepositories();
        let repositories = [];
        for (let repo of permittedRepositories) {
            repositories.push({
                id: repo.repositoryRow.id,
                name: repo.repositoryRow.name,
            });
        }
        return {
            success: true,
            data: {
                repositories,
            },
        };
    },
});
SINVAPI.addAction('repo/getTypes', {
    needsAuthentication: true,
    needsPermissions: [],
    requiresDataFields: ['repositoryID'],
    actionHandler: async (data, auth) => {
        let repo: SINVRepositories.Repository =
            await SINVRepositories.getRepository(data.repositoryID);
        await repo.userHasPermissionOrThrow({ sessionID: auth.sessionID });
        return {
            success: true,
            data: {
                types: await repo.getTypes(),
            },
        };
    },
});
SINVAPI.addAction('repo/changeTypeName', {
    needsAuthentication: true,
    needsPermissions: [],
    requiresDataFields: ['repositoryID', 'categoryID', 'name'],
    actionHandler: async (data, auth) => {
        let repo = await SINVRepositories.getRepository(data.repositoryID);
        await repo.userHasPermissionOrThrow({ sessionID: auth.sessionID });
        await repo.changeTypeName(data.categoryID, data.name);
        return { success: true };
    },
});
SINVAPI.addAction('repo/deleteType', {
    needsAuthentication: true,
    needsPermissions: [],
    requiresDataFields: ['repositoryID', 'categoryID'],
    actionHandler: async (data, auth) => {
        let repo = await SINVRepositories.getRepository(data.repositoryID);
        await repo.userHasPermissionOrThrow({ sessionID: auth.sessionID });
        await repo.deleteType(data.categoryID);
        return { success: true };
    },
});
SINVAPI.addAction('repo/createType', {
    needsAuthentication: true,
    needsPermissions: [],
    requiresDataFields: ['repositoryID', 'name'],
    actionHandler: async (data, auth) => {
        let repo = await SINVRepositories.getRepository(data.repositoryID);
        await repo.userHasPermissionOrThrow({ sessionID: auth.sessionID });
        await repo.createType(data.name);
        return { success: true };
    },
});
