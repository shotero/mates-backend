export default {
  env: 'development',
  host: 'http://localhost:6000',
  port: 6000,
  debug: {
    knex: true
  },
  knex: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    }
  },
  auth: {
    google: {
      key: process.env.AUTH_GOOGLE_KEY,
      secret: process.env.AUTH_GOOGLE_SECRET
    }
  }
};
