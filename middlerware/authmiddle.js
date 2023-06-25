const jwt = require('jsonwebtoken');
const db = require('../connections/connection');

const confirmauth = (req,res,next) => {
     
     const token  = req.cookies.Token;
     
     if(token){

        jwt.verify(token,process.env.ACCESS_SECRET_KEY,(err,decodedtoken)=>{

            if(err){
               console.log(err);
               res.redirect('/');
            }else{
               next();
            }     

         });

      }else{

        res.redirect('/'); 
     
      }
   }
   
module.exports = { confirmauth };