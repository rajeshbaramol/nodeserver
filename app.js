const express = require('express');
const app = express();
const cors = require('cors')
const jwt = require('jsonwebtoken');

const bodyparser = require('body-parser');
const mongoose = require('mongoose');
// const dotenv = require("dotenv");
// dotenv.config();
// mongoose.connect(process.env.DB_Url, { useNewUrlParser: true });

app.use(cors());


app.use(bodyparser.json())
const postRouter = require('./Routes/Posts');
app.use('/', postRouter);
const Port = process.env.Port ? process.env.Port : 4200;
app.listen(Port);