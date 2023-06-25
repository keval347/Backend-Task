const { Router } = require('express');
const app = Router();
const {confirmauth} = require('../middlerware/authmiddle');
const p  = require('../auths/pages');
const xyz = require('../mailer/mailer');
const db = require('../connections/connection');
const multer =  require('multer');
const fileupload = require('express-fileupload');
const fs = require('fs');

const storage = multer.diskStorage({
    
    destination: function (req, file, cb) {
        cb(null, '/storage/Files')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }

})

const upload = multer({
     storage: storage, 
})

app.get('/', confirmauth ,p.assignments);

app.get('/add',(req,res)=>{

    res.render('add_assignment',{
        username : req.cookies.userdata.name
    });

})

app.get('/delete',(req,res)=>{

    const title  =req.query.title;
    
    

    db.query('SELECT submitted_file_name FROM assignment_submit WHERE Title = ?',[title],(err,result)=>{
        
        if(err){

            console.log(err);
        
        }else{
            
            for(var i=0;i<result.length;i++){
                path=process.cwd()+"/storage/"+result[i].submitted_file_name;
                fs.unlink(path, (err,result)=> {
                    if(err){
                      console.log(err);
                      
                    }
                });
            }

        }

    })
    db.query('DELETE FROM assignments WHERE Title = "'+title+'"',(err,result)=>{

        if(err){
            console.log(err);
        }

    })

    db.query('DELETE FROM assignment_submit WHERE Title = ?',[title],(err,result)=>{
        
        if(err){
            console.log(err);
        }

    })

    res.redirect('/assignment');

});

app.post('/edit',(req,res)=>{

    const {title} = req.body;

    db.query('select * from assignments where Title ="'+title+'"',(err,result)=>{
        
        if(err){

            console.log(err);
        
        }else{

            result[0].Date = (result[0].Date).toISOString().split('T')[0];
            
            res.render('edit_assignment',{
                data : result[0],
                username : req.cookies.userdata.name
            })

        }

    })
    
});

app.post('/data/add',(req,res)=>{

    const {title, description,score,duedate} =req.body;
    
    db.query('insert into assignments set ?',{

        Title : title,
        Description : description,
        Score : score,
        Date : duedate
    
    },async(err ,result)=>{

        if(err){

            console.log('insert error',err)
        
        }else{
            
            var studentemail = "";
            var sub = "new assigment added : "+title;
            var body = "\nTitle : "+title+"\nDescription : "+description+"\nScore : "+score +"\nDue Date : "+duedate; 
            db.query('select Email from student', (err, result) => {
                
                if (err) {

                    console.log(err);
                    
                } else {
                    
                    for(var i=0;i<result.length;i++){
                        studentemail+=result[i].Email+',';                    
                    }

                    xyz(studentemail,sub,body);
                }

            })
    
            return res.render('add_assignment',{
                register : 'added sucessfully',
                username : req.cookies.userdata.name
            })
        }
    })
    
})

app.post('/update',(req,res)=>{
    
    const {title, description,score,duedate} =req.body;
    
    db.query('update assignments set ? where Title = ?',[{

        Title : title,
        Description : description,
        Score : score,
        Date : duedate
    
    },title],async (err ,result)=>{

        if(err){
            console.log('insert error',err)
        }else{
            var studentemail = "";
            var sub = "updated assignment : " + title;
            var body = "\nTitle : "+title+"\nDescription : "+description+"\nScore : "+score +"\nDue Date : "+duedate;
            var x = db.query('select Email from student', (err, result) => {
                
                if (err) {

                    console.log(err);
                    
                } else {
                    
                    for(var i=0;i<result.length;i++){
                        studentemail+=result[i].Email+',';
                    }
                    xyz(studentemail,sub,body);
                }
            })
    
            return res.redirect('/assignment');
        }
    })

})

app.use(fileupload({
  useTempFiles : true,
  tempFileDir : 'storage/'  
}))

app.post('/upload', function(req, res) {
    let sampleFile;
    let uploadPath;
    
  
    if (!req.files || Object.keys(req.files).length === 0) {
        res.redirect('/assignment');
        return;
    }
  
    sampleFile = req.files.file1;
    var name = req.cookies.userdata.email.split('@')[0];
    var title = req.body.title; 
    var type = req.files.file1.mimetype;
    type = type.split('/')[1];
    
    uploadPath = process.cwd() + '/storage/' +name+'_'+title+'.'+type;
    
    sampleFile.mv(uploadPath, function(err) {
      if (err) {
        return res.status(500).send(err);
      }
        res.redirect('/assignment');
    });

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '/' + mm + '/' + dd;

    db.query('insert into assignment_submit set ?',{
        id : name + '_'+title,
        Email : req.cookies.userdata.email,
        Title : title,
        Submitted : true,
        Reviewed : false,
        Graded_Score : 0,
        Submit_date : today,
        Submitted_file_name : name+'_'+title+'.'+type,

    },(err,result)=>{
        if(err){
            console.log(err);
        }else{
            console.log(result);
        }
    })
});

app.get('/submitted',(req,res)=>{
    const title = req.query.title;
    const column = "true";
    const dir = "ASC";
    
    db.query('SELECT S.Email,A.Title,A.Description,A.Score,A.Date,SUB.Submitted,SUB.Reviewed,SUB.Graded_Score,SUB.submitted_file_name,SUB.Submit_Date FROM student S CROSS JOIN assignments A LEFT OUTER JOIN assignment_submit SUB ON S.Email = SUB.Email AND A.Title=SUB.Title where A.Title = ? ORDER BY ? ?;',[title,column,dir],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            if(result.length>0){
                for(var i=0;i<result.length;i++){
                    if(result[i].Submit_Date!=null) result[i].Submit_Date = (result[i].Submit_Date).toISOString().split('T')[0];
                }
                res.render('submitted_assignment',{
                    message : result[0].Title,
                    data : result,
                    username : req.cookies.userdata.name
                })
            }else{
                res.render('submitted_assignment',{
                    message : "Assignment not uploaded yet",
                    username : req.cookies.userdata.name
                }) 
            }
        }
    })
})

app.post('/review',(req,res)=>{
    const {email,title,score,graded_score} = req.body;

    db.query('update assignment_submit set ? where Email="'+email+'" and Title="'+title+'"',{
        Graded_Score : graded_score,  
        Reviewed : true,   
    },(err,result)=>{
        if(err){
            console.log(err);
        }else{
            console.log(result);
            res.redirect('/assignment/submitted?title='+title);
        }
    })
})

app.get('/view',(req,res)=>{
    path=process.cwd()+"/storage/"+req.query.file;
    res.sendFile(path);
})

app.get('/remove',(req,res)=>{
    const file = req.query.file;
    path=process.cwd()+"/storage/"+file;
    fs.unlink(path, (err,result)=> {
              if(err){
                console.log(err);
                res.send('no file found');
              }else{
                db.query('delete from assignment_submit where submitted_file_name = ?',[file],(err,result)=>{
                    if(err){
                        console/log(err);
                    }else{
                        console.log(result);
                    }
                })
                res.redirect('/assignment');
              }
    });
})

module.exports = app;