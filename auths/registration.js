const db = require('../connections/connection');
const bcrypt = require('bcryptjs');

exports.register = (req,res) => {

    const { name, email, password, confirmpassword, role} = req.body;

    db.query('select * from '+ role +' where Email = ?',[email], async (err,result) => {
        
        if(err){
            console.log(err);
        }
        if(!result){
            return res.send();
        }else if(result.length > 0 ){

            return res.render('register',{
                message : 'email is already exist'
            });

        }else if(password !== confirmpassword){
            
            return res.render('register',{
                message : 'password does not match'
            });

        }

        let hashedpass = await bcrypt.hash(password,8);
        
        db.query('insert into '+role+' set ?',{
            
            Name : name,
            Email : email,
            Password : hashedpass

        },(err ,result)=>{

            if(err){

                console.log('insert error',err)
            
            }else{

                return res.render('register',{
                    register : 'register sucessfully'
                })

            }
            
        })

    });

}