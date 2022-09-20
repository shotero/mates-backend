const path = require('path');

module.exports = {
  baseUrl: 'https://genschema.com',
  schemaVersion: 'http://json-schema.org/draft-07/schema#',
  generate: {
    controller: true,
    route: true
  },
  path: {
    write: path.join(process.cwd(), 'api'),
    import: '#api'
  },
  db: {
    database: 'db',
    user: 'system'
  },
  schemas: [
    {
      name: 'public',
      renames: {},
      ignores: ['world', 'hello']
    }
  ]
};
