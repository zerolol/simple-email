const Router = require('koa-router');

const router = new Router();
const userController = require('../controllers/userController');

router.post('/email/login', userController.login);
router.post('/email/regist', userController.regist);
router.post('/email/modifyPassword', userController.modifyPassword);

module.exports = router;
