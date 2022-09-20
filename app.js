import 'dotenv/config';
import Knex from 'knex';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import config from './config/index.js';
import cors from '@koa/cors';
import grant from 'grant';
import logger from 'koa-accesslog';
import objection from 'objection';
import qs from 'koa-qs';
import router from './api/routes.js';
import session from 'koa-session';
import { errorHandler } from './middlewares/errors.js';

const knex = Knex(config.knex);
objection.Model.knex(knex);
if (config.debug.knex) knex.on('query', console.log);

const app = new Koa();
qs(app);
app.keys = [config.secret];

app
  .use(cors())
  .use(logger())
  .use(errorHandler)
  .use(session(app))
  .use(grant.koa()(config.grant))
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

app.context.db = knex;
app.context.config = config;

const port = parseInt(config.port) || 6000;
const server = app.listen(port, () => {
  console.log('Example app listening at port %s', server.address().port);
});
