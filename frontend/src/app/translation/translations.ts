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
    en: 'Create an object',
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
};
