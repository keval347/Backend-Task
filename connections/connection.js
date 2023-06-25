const mysql = require('mysql');

const db = mysql.createConnection({
    host : "sql12.freesqldatabase.com",
    user : "sql12595646",
    password : "J2C2ixmrhK",
    database : "sql12595646",
    port : 3306
})


db.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("connection established");
    }
})

module.exports = db;