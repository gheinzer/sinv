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
};
