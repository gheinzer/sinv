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
};
