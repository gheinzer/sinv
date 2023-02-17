export type permission =
    | 'login'
    | 'superuser'
    | 'repositoryAdmin'
    | 'upload'
    | 'userAdmin';
export type permissionObject = {
    [key in permission]: boolean;
};
