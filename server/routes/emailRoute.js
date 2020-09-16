const Router = require('koa-router');

const router = new Router();
const emailController = require('../controllers/emailController');

router.post('/email/sendLetter', emailController.sendEmail);
router.post('/email/getInbox', emailController.getInbox);
router.post('/email/deleteLetter', emailController.deleteLetter);
router.post('/email/getEmailDetail', emailController.getEmailDetail);
router.get('/email/qiniuToken', emailController.getQiniuToken);

module.exports = router;
