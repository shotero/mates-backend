import dev from './dev.js';
import prod from './prod.js';

let envConfig = {};
if (process.env.NODE_ENV === 'development') {
  envConfig = dev;
} else {
  envConfig = prod;
}

const config = {
  database: process.env.DATABASE_URL,
  secret: process.env.APP_SECRET,
  grant: {
    defaults: {
      origin: envConfig.host,
      transport: 'session'
    },
    google: {
      key: envConfig.auth.google.key,
      secret: envConfig.auth.google.secret,
      callback: '/auth/google',
      response: ['tokens', 'jwt', 'profile'],
      scope: [
        'openid', 'email', 'profile'
      ]
    }
  }
};

Object.assign(config, envConfig);

export default config;
