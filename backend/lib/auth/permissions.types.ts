export type permission = 'login' | 'superuser' | 'repositoryAdmin';
export type permissionObject = {
    [key in permission]: boolean;
};
