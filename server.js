const mongoose = require('mongoose');
const dotenv = require('dotenv');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

dotenv.config({ path: './config.env' })

const DB = process.env.DATABASE
    .replace('<username>', process.env.DATABASE_ACCOUNT)
    .replace('<password>', process.env.DATABASE_PASSWORD)

mongoose
    .connect(DB)
    .then(() => console.log('資料庫連接成功'));

var indexRouter = require('./routes/index');
var postRouter = require('./routes/post');

var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))


app.use('/', indexRouter);
app.use('/posts', postRouter);

module.exports = app;
