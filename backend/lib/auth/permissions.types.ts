export type permission = 'login' | 'superuser' | 'repositoryAdmin' | 'upload';
export type permissionObject = {
    [key in permission]: boolean;
};
