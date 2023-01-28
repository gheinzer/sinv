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
  addObject: {
    en: 'Add object',
    de: 'Objekt hinzufügen',
  },
};
