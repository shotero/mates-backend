import Router from '@koa/router';
import pub from './public/index.js';

const router = new Router();

router.use('/public', pub.routes());

export default router;
