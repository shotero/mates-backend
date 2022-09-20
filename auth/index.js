import Router from '@koa/router';
import { response } from './google.js';

const router = new Router();

router.get('/google', response);

export default router;
