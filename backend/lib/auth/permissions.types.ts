export const permissionNames = [
    'login',
    'superuser',
    'repositoryAdmin',
    'upload',
    'userAdmin',
] as const;

export type permission = typeof permissionNames[number];
export type permissionObject = {
    [key in permission]: boolean;
};
