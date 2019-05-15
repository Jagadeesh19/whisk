const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const Admin=require("../models/admin");
const Employee=require("../models/employee");

exports.postLogin=(req,res,next)=>{
 const username=req.body.username;
 const password=req.body.password;
 let user;

 console.log("I am called");

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
         expiresIn: 3600
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
         expiresIn: 3600
       })
     })
     .catch(err=>{
       return res.status(401).json({
         message:"Auth failed"
       })
     })
 }
}
