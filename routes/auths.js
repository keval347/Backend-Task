const express = require('express');
const r = require('../auths/registration');
const l = require('../auths/login');
const app = express();

app.post('/register', r.register );

app.post('/login',l.login);

module.exports = app;