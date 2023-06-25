const db = require('../connections/connection');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcryptjs');


exports.login = (req,res) => {

    const { email, password ,role } = req.body;

    db.query('select * from '+role+' where Email = "'+email+'"',async (err,result) => {
        if(err){
            console.log(err);
        }
        if(!result){
            return res.render('login',{
                message : 'user does not exist, please register'
            });
        }
        if(result.length > 0 ){
            
            
            if( await bcrypt.compare(password,result[0].Password)){
                
                const user = {
                    email : email,
                    role : role,
                    name : result[0].Name
                }

                const accesstoken = jwt.sign(user,process.env.ACCESS_SECRET_KEY);
                // res.cookie('Token',accesstoken,{maxAge : 1000*30});
                res.cookie('Token',accesstoken);
                return res.redirect('/profile');

            }else{

                return res.render('login',{
                    message : 'password is wrong'
                });

            }
              
        }else{

            return res.render('login',{
                message : 'user does not exist, please register'
            });
            
        }
        
    });

}