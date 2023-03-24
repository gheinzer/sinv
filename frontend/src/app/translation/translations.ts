interface translation {
  de: string;
  en: string;
}

export var translations: { [key: string]: translation } = {
  username: {
    en: 'Username',
    de: 'Benutzername',
  },
  password: {
    en: 'Password',
    de: 'Passwort',
  },
  login: {
    en: 'Sign in',
    de: 'Anmelden',
  },
  register: {
    en: 'Sign up',
    de: 'Registrieren',
  },
  userNotFound: {
    en: 'The user you are looking for was not found.',
    de: 'Dieser Benutzer existiert nicht.',
  },
  passwordWrong: {
    en: 'The password you entered is invalid.',
    de: 'Das eingegebene Passwort ist ungültig.',
  },
  logout: {
    en: 'Sign out',
    de: 'Abmelden',
  },
  settings: {
    en: 'Settings',
    de: 'Einstellungen',
  },
  latestObjects: {
    en: 'Latest objects',
    de: 'Letzte Objekte',
  },
  createObject: {
    en: 'Create object',
    de: 'Objekt hinzufügen',
  },
  name: {
    en: 'Label',
    de: 'Bezeichnung',
  },
  nameHint: {
    en: "Use a short and unique name, so you won't have problems searching for this object later.",
    de: 'Benützen Sie einen kurzen und einzigartigen Namen, damit Sie dieses Objekt später einfacher wieder finden.',
  },
  actionNotAvailable: {
    en: 'This action is currently not available.',
    de: 'Diese Aktion ist gerade nicht verfügbar.',
  },
  notAvailableOnMobile: {
    en: 'This action cannot be used on mobile.',
    de: 'Diese Aktion kann auf Smartphones leider nicht verwendet werden.',
  },
  description: {
    en: 'Description',
    de: 'Beschreibung',
  },
  descriptionHint: {
    en: 'Information written in the description can be found with the search feature, but information in the attachments not.',
    de: 'Informationen in der Beschreibung können mittels der Suchfunktion gefunden werden, während Informationen in den Anhängen nicht auf diese Weise durchsucht werden können.',
  },
  identifier: {
    en: 'Identifier',
    de: 'Identifikationsnummer',
  },
  identifierHint: {
    en: 'Use a unique and short identifier that you ideally associate with the object in some way (eg. with a label). The identifier can also consist of letters.',
    de: 'Benutzen Sie eine kurze und einmalige Identifikationsnummer, welche Sie mit dem Objekt, beispielsweise mit einem Label, assoziieren. Die Identifikationsnummer kann auch aus Buchstaben bestehen.',
  },
  searchNormalPlaceholder: {
    en: 'Search',
    de: 'Suche',
  },
  searchIDPlaceholder: {
    en: 'Identifier',
    de: 'ID',
  },
  upload: {
    en: 'Upload',
    de: 'Hochladen',
  },
  uploadZoneHint: {
    en: 'Drag and drop a file for uploading it as an attachment.',
    de: 'Ziehen Sie ein Element über diesen Bereich, um es als Anhang hochzuladen.',
  },
  attachments: {
    en: 'Attachments',
    de: 'Anhänge',
  },
  addAttachment: {
    en: 'Add attachment',
    de: 'Anhang hinzufügen',
  },
  repoSettings: {
    en: 'Repository settings',
    de: 'Ablageneinstellungen',
  },
  repoChangingHint: {
    en: 'You can change your repository with the dropdown list the upper-left corner.',
    de: 'Sie können die Ablage mit der Dropdown-Liste oben rechts ändern.',
  },
  categories: {
    en: 'Categories',
    de: 'Kategorien',
  },
  attachmentCategories: {
    en: 'Attachment categories',
    de: 'Anhangkategorien',
  },
  delete: {
    en: 'Delete',
    de: 'Löschen',
  },
  categoriesInfoText: {
    en: 'Categories are applied on objects and can be used to filter for specific types of objects. You can only apply one category on an object at a time.',
    de: 'Kategorien können auf Objekte angewendet werden und zum Filtern der Objekte verwendet werden. Sie können einem Objekt jeweils nur eine Kategorie zuweisen.',
  },
  noCategoriesDefined: {
    en: 'No categories defined.',
    de: 'Keine Kategorien definiert.',
  },
  addCategory: {
    en: 'Add category',
    de: 'Kategorie hinzufügen',
  },
  categoryName: {
    en: 'Category name',
    de: 'Kategoriename',
  },
  category: {
    en: 'Category',
    de: 'Kategorie',
  },
  addAttachmentCategory: {
    en: 'Add attachment category',
    de: 'Anhangkategorie hinzufügen',
  },
  attachmentCategoryName: {
    en: 'Attachment category name',
    de: 'Anhangkategoriename',
  },
  identifierAlreadyExists: {
    en: 'This identifier already exists.',
    de: 'Diese Identifikationsnummer exisitert bereits.',
  },
  search: {
    en: 'Search',
    de: 'Suche',
  },
  noResultsFound: {
    en: 'No results found.',
    de: 'Keine Ergebnisse gefunden.',
  },
  home: {
    en: 'Home',
    de: 'Home',
  },
  identififerDoesNotExist: {
    en: 'Identifier does not exist',
    de: 'Identifikationsnummer existiert nicht',
  },
  adminSettings: {
    en: 'Admin settings',
    de: 'Administrationseinstellungen',
  },
  userManagement: {
    en: 'User management',
    de: 'Benutzerverwaltung',
  },
  repoManagement: {
    en: 'Repository management',
    de: 'Ablagenverwaltung',
  },
  createUser: {
    en: 'Create user',
    de: 'Benutzer hinzufügen',
  },
  createRepository: {
    en: 'Create repository',
    de: 'Ablage hinzufügen',
  },
  nUsersHaveAccess: {
    en: ' users have access',
    de: ' Benutzer haben Zugriff.',
  },
  manageRepository: {
    en: 'Manage Repository',
    de: 'Ablage verwalten',
  },
  save: {
    en: 'Save',
    de: 'Speichern',
  },
  managePermissions: {
    en: 'Manage permissions',
    de: 'Berechtigungen verwalten',
  },
  repositoryNameUsed: {
    en: 'This name is already used.',
    de: 'Dieser Name wird schon verwendet.',
  },
  descriptionEmpty: {
    en: 'Please enter a description.',
    de: 'Bitte geben Sie eine Beschreibung ein.',
  },
  nameEmpty: {
    en: 'Please enter a name',
    de: 'Bitte geben Sie einen Namen ein',
  },
  searchUser: {
    en: 'Search username',
    de: 'Benutzername',
  },
  givePermission: {
    en: 'Give access',
    de: 'Zugang erlauben',
  },
  revokePermission: {
    en: 'Revoke access',
    de: 'Zugang entfernen',
  },
  close: {
    en: 'Close',
    de: 'Schliessen',
  },
  deleteRepository: {
    en: 'Delete repository',
    de: 'Ablage löschen',
  },
  noSpecialPermissions: {
    en: 'No special permissions',
    de: 'Keine speziellen Berechtigungen',
  },
  usernameAlreadyExists: {
    en: 'This username is already in use',
    de: 'Dieser Benutzername wird bereits verwendet',
  },
  newUserCreatedHint: {
    en: 'Please forward the link below to the owner of the account so the password can be set.',
    de: 'Bitte leiten Sie den untenstehenden Link an den Besitzer des Kontos weiter, damit das Passwort festgelegt werden kann.',
  },
  copyAndClose: {
    en: 'Copy and close',
    de: 'Kopieren und schliessen',
  },
  manageUser: {
    en: 'Manage user',
    de: 'Benutzer verwalten',
  },
  passwordResetHint: {
    en: 'Please forward the link below to the owner of the account so they can reset their password.',
    de: 'Bitte leiten Sie den untenstehenden Link an den Besitzer des Kontos weiter, damit das Passwort zurückgesetzt werden kann.',
  },
  'permissionInfo-login': {
    en: 'Allows the user to login and perform very basic actions. If revoked, the user cannot do anything and is blocked.',
    de: 'Erlaubt dem Benutzer das Anmelden und die Durchführung von einigen Aktionen. Ist diese Berechtigung nicht gegeben, ist der Benutzer blockiert.',
  },
  'permissionInfo-superuser': {
    en: 'Allows the user to do anything and grants all permissions.',
    de: 'Erlaubt dem Benutzer das Durchführen von allen Aktionen und gibt somit alle Berechtigungen.',
  },
  'permissionInfo-repositoryAdmin': {
    en: 'Allows the administration of all repositories including deleting, creating repositories and changing repository permissions.',
    de: 'Erlaubt die Administration von allen Ablagen. Das beinhaltet auch das Erstellen, Löschen von Ablagen und das ändern von Ablage-Berechtigungen.',
  },
  'permissionInfo-userAdmin': {
    en: 'Allows the administration of all users including deleting and creating users, resetting passwords and managing user permissions.',
    de: 'Erlaubt die Administratino von allen Benutzern. Das beinhaltet auch das Erstellen und löschen von Benutzern, das Zurücksetzen von Passwörtern sowie das Ändern von Benutzerberechtigungen.',
  },
  'permissionInfo-upload': {
    en: 'Allows the user to upload files to the server. Revoke this permission if you think someone is filling your storage unnecessarily.',
    de: 'Erlaubt das Hochladen von Dateien auf den Server. Deaktivieren Sie diese Berechtigungen, wenn Sie vermuten, dass jemand Ihren Speicherplatz unnötigerweise füllt.',
  },
  newPassword: {
    en: 'New password',
    de: 'Neues Passwort',
  },
  newPasswordRepeat: {
    en: 'Repeat password',
    de: 'Passwort wiederholen',
  },
  passwordResetTitle: {
    en: 'Set password',
    de: 'Passwort setzen',
  },
  passwordsNotEqual: {
    en: 'The two passwords you entered are not the same.',
    de: 'Die beiden eingegebenen Passwörter stimmen nicht überein.',
  },
  forgotPassword: {
    en: 'Reset password',
    de: 'Passwort zurücksetzen',
  },
  submit: {
    en: 'Submit',
    de: 'Senden',
  },
};
