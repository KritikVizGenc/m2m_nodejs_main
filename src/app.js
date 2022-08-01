const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
require('dotenv').config();


require("./auth/passport")
require("./models/user")

const middlewares = require('./middlewares');
const controller = require('./controller');

const app = express();


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'buradasınız'
  });
});

app.use('/api', controller);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
