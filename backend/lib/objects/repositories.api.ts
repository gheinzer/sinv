import { SINVAPI } from '../api/api';
import { SINVUserSystem } from '../auth/users';

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
