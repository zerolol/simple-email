const Koa = require('koa');

// https://www.npmjs.com/package/koa2-cors
const cors = require('koa2-cors');

// https://www.npmjs.com/package/koa-bodyparser
const bodyParser = require('koa-bodyparser');

// https://github.com/Automattic/mongoose
const mongoose = require('mongoose');
const config = require('./config/DBconfig.js');
const { checkToken } = require('./utils/token');

const app = new Koa();
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false)
mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) {
    console.error('Failed to connect to database');
  } else {
    console.log('Connecting database successfully');
  }
});

app.use(cors());
app.use(bodyParser());
app.use(checkToken);
const userRouter = require('./routes/userRoute');
const checkCodeRouter = require('./routes/checkCodeRoute');
const emailRouter = require('./routes/emailRoute');

app.use(userRouter.routes()).use(userRouter.allowedMethods());
app.use(checkCodeRouter.routes()).use(checkCodeRouter.allowedMethods());
app.use(emailRouter.routes()).use(emailRouter.allowedMethods());

app.listen(config.port);
