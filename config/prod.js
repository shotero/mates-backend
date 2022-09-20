export default {
  env: 'production',
  host: 'https://api.mates.camp',
  debug: {
    knex: false
  },
  knex: {
    client: 'postgresql',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    },
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
