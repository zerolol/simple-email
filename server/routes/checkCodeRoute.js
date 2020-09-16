const Router = require('koa-router');

const router = new Router();
const checkCodeController = require('../controllers/checkCodeController');

router.get('/email/getcode', checkCodeController.getCode);

module.exports = router;
