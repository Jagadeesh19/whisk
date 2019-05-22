const crypto=require("crypto");

const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const nodemailer=require("nodemailer");
const sendgrid=require("nodemailer-sendgrid-transport");


const Admin=require("../models/admin");
const Employee=require("../models/employee");

const transporter=nodemailer.createTransport(sendgrid({
  auth:{
    api_key:"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"
  }
}))

exports.postLogin=(req,res,next)=>{
 const username=req.body.username;
 const password=req.body.password;
 let user;


 if (username==="admin"){
   Admin.findOne()
     .then(admin=>{
       user=admin;
       return bcrypt.compare(password,admin.password)
     })
     .then(result=>{
       if (!result){
         return res.status(401).json({
           message:"Auth failed"
         });
       }
       const token=jwt.sign(
         {
           username: username,
           userId: user._id
         },
         "GSPANN_is_equal_to_WHISK_admin",
         {
           expiresIn: "1h"
         }
       );
       res.status(200).json({
         token: token,
         expiresIn: 3600,
         userType:"admin",
         userId:user._id
       })
     })
     .catch(err=>{
       res.status(401).json({
         message:"Auth failed"
       });
     })
 }
 else{
   Employee.findOne({email: username})
     .then(employee=>{
       user=employee;
        if (!employee){
          return res.status(401).json({
            message:"Auth failed"
          })
        }
        return bcrypt.compare(password,employee.password)
     })
     .then(result=>{
       if (!result){
         return res.status(401).json({
           message:"Auth failed"
         });
       }
       const token=jwt.sign(
         {
           username: username,
           userId: user._id
         },
         "GSPANN_is_equal_to_WHISK_employee",
         {
           expiresIn: "1h"
         }
       );
       res.status(200).json({
         token: token,
         expiresIn: 3600,
         userType:"employee",
         userId:user._id
       })
     })
     .catch(err=>{
       return res.status(401).json({
         message:"Auth failed"
       })
     })
 }
}

exports.postReset=(req,res,next)=>{
  const username=req.body.username;
  let adminEmail;

  crypto.randomBytes(32,(err,buffer)=>{
    if (err){
      console.log(err);
      res.status(500).json({
        message:"Some error occured"
      })
    }

    const token=buffer.toString("hex");
    if (username==="admin"){
      Admin.findOne()
        .then(admin=>{
          adminEmail=admin.email;
          admin.resetToken=token;
          admin.resetTokenExpiration=Date.now()+3600000;
          return admin.save();
        })
        .then(result=>{
          res.status(200).json({
            message:"success"
          })
          transporter.sendMail({
            to: adminEmail,
            from: "reset@whisk.com",
            subject: "Password Reset",
            html: `
            <h3>You requested for a password reset</h3>
            <h3>Follow the below link to reset your password</h3>
            <p><a href="http://localhost:4200/reset/${token}?userType=admin">click here</a> </p>
            `
          })
        })
    }
    else{
      Employee.findOne({email:username})
        .then(employee=>{
          if (!employee){
            return res.status(422).json({
              message:"username does not exists"
            })
          }
          employee.resetToken=token;
          employee.resetTokenExpiration=Date.now()+3600000;
          employee.save()
            .then(result=>{
              res.status(200).json({
                message:"success"
              })
              transporter.sendMail({
                to: employee.email,
                from: "reset@whisk.com",
                subject: "Password Reset",
                html: `
            <h3>You requested for a password reset</h3>
            <h3>Follow the below link to reset your password</h3>
            <p><a href="http://localhost:4200/reset/${token}?userType=employee">click here</a> </p>
            `
              })
            })
        })
    }
  })
}

exports.postValidToken=(req,res,next)=>{
  const token=req.body.token;
  const userTYpe=req.body.userType;
  if (userTYpe==="admin"){
    return Admin.findOne({resetToken:token,resetTokenExpiration: {$gt: Date.now()}})
      .then(admin=>{
        if (admin) return res.status(200).json({message:"success"});
        res.status(404).json({
          message:"invalid token"
        })
      })
      .catch(err=>{
        console.log(err);
      })
  }
  Employee.findOne({resetToken:token,resetTokenExpiration: {$gt: Date.now()}})
    .then(employee=>{
      if (employee) return res.status(200).json({message:"success"});
      res.status(404).json({
        message:"invalid token"
      })
    })
    .catch(err=>{
      console.log(err);
    })
}

exports.postNewPassword=(req,res,next)=>{
  const newPassword=req.body.password;
  const userType=req.body.userType;
  const token=req.body.token;

  let resetUser;

  if (userType==="admin"){
    return Admin.findOne({resetToken:token,resetTokenExpiration: {$gt: Date.now()}})
      .then(admin=>{
        resetUser=admin;
        return bcrypt.hash(newPassword,12)
      })
      .then(hashedPassword=>{
        resetUser.password=hashedPassword;
        resetUser.resetToken=undefined;
        resetUser.resetTokenExpiration=undefined;
        return resetUser.save()
      })
      .then(result=>{
        res.status(200).json({
          message:"Reset password successful"
        })
      })
      .catch(err=>{
        console.log(err);
      })
  }

  Employee.findOne({resetToken:token,resetTokenExpiration: {$gt: Date.now()}})
    .then(employee=>{
      resetUser=employee;
      return bcrypt.hash(newPassword,12)
    })
    .then(hashedPassword=>{
      resetUser.password=hashedPassword;
      resetUser.resetToken=undefined;
      resetUser.resetTokenExpiration=undefined;
      return resetUser.save()
    })
    .then(result=>{
      res.status(200).json({
        message:"Reset password successful"
      })
    })
}
