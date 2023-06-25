var nodemailer = require('nodemailer');

const sendmail = (to,sub,text)=>{

    var transporter = nodemailer.createTransport({
        
      service : 'gmail',
      auth: {
          user: 'kluvani222@gmail.com',
          pass: 'dbizogqsifqzwkvp'
      }

    });

    var mailOptions = {
      
      from: 'kluvani222@gmail.com',
      to: to,
      subject: sub,
      text: text
    
    };
      
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  }
  
module.exports = sendmail;




