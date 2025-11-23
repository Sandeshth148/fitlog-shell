const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({

  name: 'fitlog-shell',

  exposes: {
    './TranslationService': './src/app/core/services/translation.service.ts',
  },

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: false,  // Allow minor version differences (19.2.0 works with 19.2.3)
      requiredVersion: 'auto'
    }),
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
    // Add further packages you don't need at runtime
  ]

  // Please read our FAQ about sharing libs:
  // https://shorturl.at/jmzH0

});
