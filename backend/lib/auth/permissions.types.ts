export type permission = 'login' | 'superuser';
export type permissionObject = {
    [key in permission]: boolean;
};
