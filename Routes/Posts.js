const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const regmodel = require('../models/PostModel');
const mongoose = require('mongoose');
const PostModel = require('../models/PostModel');
const dotenv = require("dotenv");
const ParseError = require('../utils/ParseErrors');
process.env.DB_Url = "mongodb://127.0.0.1:27017/RNClient";

router.post('/api/register', async (req, res) => {
    const post = new PostModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    })
    console.log(post.model.setPassword);
    mongoose.connect(process.env.DB_Url, { useNewUrlParser: true }, (err, db) => {
        db.collection('register').insertOne(post, (err, result) => {

            if (err) res.status(400).json({ errors: { global: ParseError(err.err) } })
            else {
                const token = jwt.sign({
                    email: result.email,
                    username: result,
                }, 'screat',
                    {
                        expiresIn: "1h",
                    });
                res.json({
                    messgage: "Registered",
                    user: result[0],
                    token: token
                });
            }
            db.close();
        })
    })
})

router.post('/api/login', async (req, res) => {
    mongoose.connect(process.env.DB_Url, { useNewUrlParser: true }, (err, db) => {
        console.log(req.body)
        db.collection('register').find({ "email": req.body.email, "password": req.body.password }).toArray((err, result) => {
            if (result.length > 0) {
                const token = jwt.sign({
                    email: result[0].email,
                    username: result[0].firstName + " " + result[0].lastName,
                    userid: result[0]._id
                }, 'screat',
                    {
                        expiresIn: "1h",
                    });
                res.json({
                    messgage: "Auth successful",
                    user: result[0],
                    token: token
                })
            } else {
                res.status(400).json({ errors: { global: "Invalid Credentials" } })
            }
        })
    })
})
router.get('/users', async (req, res) => {

    mongoose.connect('mongodb://127.0.0.1:27017/RNClient', { useNewUrlParser: true }, (err, db) => {
        db.collection('register').find().toArray((err, result) => {
            res.send(result);
        })

        db.close();
    })
})
router.get('/api/application-list', async (req, res) => {
    mongoose.connect('mongodb://127.0.0.1:27017/RNClient', { useNewUrlParser: true }, (err, db) => {
        db.collection('products').find().limit(100).toArray((err, result) => {
            res.json(result);
        })

        db.close();
    })
})

verifyToken = (req, res, next) => {
    const headers = req.headers['authorization'];
    if (headers !== "undefined") {
        const bearToken = headers[1];
        req.token = bearToken;
        next()

    } else {
        res.send("Please Login")
    }
}
module.exports = router;