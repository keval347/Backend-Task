const {Router } = require('express');
const app = Router();
const {confirmauth} = require('../middlerware/authmiddle');
const p  = require('../auths/pages');

app.get('/',(req,res)=>{
    res.render('login');
})

app.get('/register',(req,res)=>{
    res.render('register');
})

app.get('/profile', confirmauth ,p.profile);

app.get('/logout',p.logout);

module.exports = app;