const db = require('../connections/connection');
const jwt = require('jsonwebtoken');
exports.profile = (req,res)=>{
    
    const token = req.cookies.Token;
    var data;

    jwt.verify(token,process.env.ACCESS_SECRET_KEY,(err,decodedtoken)=>{
        data = decodedtoken;
    })

    res.cookie('userdata',data);
    
    res.render('profile',{
        userdata : data,
        username : data.name
    });

}

exports.assignments = (req,res)=>{

    const token = req.cookies.Token;
    var data;

    jwt.verify(token,process.env.ACCESS_SECRET_KEY,(err,decodedtoken)=>{
        data = decodedtoken;
    })

    if(data.role=="teacher"){
        db.query('select * from assignments',(err,result)=>{

            if(err){
                res.send(err);
            }else{
                
                for(var i=0;i<result.length;i++){
                    if(result[i].Date != null) result[i].Date = (result[i].Date).toISOString().split('T')[0];
                }

                res.render('teacher_assignment',{
                    title : 'Assignment list',
                    data : result,
                    userdata : data,
                    username : data.name
                });
            }
            
        });

    }else{

        student = data.email;
        column  = "true";
        dir = "ASC";

        db.query('SELECT S.Email,A.Title,A.Description,A.Score,A.Date,SUB.Submitted,SUB.Reviewed,SUB.Graded_Score,SUB.submitted_file_name,SUB.Submit_Date FROM student S CROSS JOIN assignments A LEFT OUTER JOIN assignment_submit SUB ON S.Email = SUB.Email AND A.Title=SUB.Title where S.Email = ? ORDER BY ? ?;',[student,column,dir],(err,result)=>{
            
            if(err){

                console.log(err);
                return err;

            }else{

                for(var i=0;i<result.length;i++){
                    if(result[i].Date != null) result[i].Date = (result[i].Date).toISOString().split('T')[0];
                    if(result[i].Submit_Date != null) result[i].Submit_Date =(result[i].Submit_Date).toISOString().split('T')[0];
                }
                
                res.render('student_assignment',{
                    title : 'Assignment list',
                    data : result,
                    userdata : data,
                    username : data.name
                });
            
            }
        
        })
        
    }
    
}

exports.logout = (req,res)=>{

    res.cookie('Token','',{maxAge : 1});
    res.render('login');

}