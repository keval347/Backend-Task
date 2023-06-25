const path = require('path');
const express  = require('express');
const app = express();
const hbs = require('hbs');
const CP = require('cookie-parser');
const pages = require('./routes/pages');
const auths = require('./routes/auths');
const assignments = require('./routes/assignments');
const PORT = process.env.PORT || 3000;

app.set('view engine','hbs');
app.use(CP());
app.use(express.static(path.join(__dirname, 'public')))
hbs.registerPartials(path.join(__dirname,'./partials'));


app.use(express.urlencoded({ extended : false }));
app.use(express.json()); 

app.use('/',pages);
app.use('/auths',auths);
app.use('/assignment',assignments);

app.listen(PORT,(req,res)=>{
    console.log("Listening on port",PORT);
})

class customError extends Error{
    
}