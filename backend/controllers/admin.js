const crypto=require("crypto");

const bcrypt=require("bcrypt");
const nodemailer=require("nodemailer");
const sendgrid=require("nodemailer-sendgrid-transport");

const Employee=require("../models/employee");

const transporter=nodemailer.createTransport(sendgrid({
  auth:{
    api_key:API_KEY
  }
}))

exports.postAddEmployee=(req,res,next)=>{
  const name=req.body.name;
  const email=req.body.email.toLowerCase();
  const joinDate=req.body.joinDate;
  const dateOfBirth=req.body.dateOfBirth;
  const gender=req.body.gender;
  let supervisorEmail=req.body.supervisorEmail;
  if (supervisorEmail){
    supervisorEmail=supervisorEmail.toLowerCase();
  }
  let password;
  let employee;

  crypto.randomBytes(7,(err,bytes)=>{
    password=bytes.toString("base64");
    bcrypt.hash(password,12)
      .then(hashedPassword=>{
        if (supervisorEmail){
          Employee.findOne({email:supervisorEmail})
            .then(supervisor=>{
              employee=new Employee({
                name:name,
                email:email,
                password:hashedPassword,
                joinDate: joinDate,
                dateOfBirth: dateOfBirth,
                gender:gender,
                supervisor:supervisor._id
              })
              supervisor.supervisee.push(employee._id);
              return supervisor.save()
            })
            .then(result=>{
              return employee.save()
            })
            .then(result=>{
              res.json({
                message:"Success"
              })
              return transporter.sendMail({
                to: email,
                from: "admin@whisk.com",
                subject:"account created",
                html:`
                <h3>Your account has been created at Whisk</h3>
                <h3>username: ${email}<br/>password: ${password}</h3>
                <h3>Kindly change your password.</h3>
              `
              })
            })
            .catch(err=>{
              console.log(err);
              if (err.name==="ValidationError"){
                res.json({
                  message:"The employee with the above email already exists"
                })
              }
              else{
                res.json({
                  message:"The supervisor does not exist"
                })
              }
            })
        }
        else{
          employee=new Employee({
            name:name,
            email:email,
            password:hashedPassword,
            joinDate: joinDate,
            dateOfBirth: dateOfBirth,
            gender:gender,
            supervisor:null
          })
          employee.save()
            .then(result=>{
              res.json({
                message:"Success"
              })
              return transporter.sendMail({
                to: email,
                from: "admin@whisk.com",
                subject:"account created",
                html:`
                <h3>Your account has been created at Whisk</h3>
                <h3>username: ${email}<br/>password: ${password}</h3>
                <h3>Kindly change your password.</h3>
              `
              })
            })
            .catch(err=>{
              console.log(err);
              res.json({
                message:"The employee with the above email already exists"
              })
            })
        }
      })
  })
}

exports.getEmployees=(req,res,next)=>{
  Employee.find()
    .populate("supervisor")
    .then(employees=>{
      res.json(employees);
    })
}

exports.postRemoveEmployees=(req,res,next)=>{
  const employeeId=req.params.id;
  let supervisorId;
  Employee.findById(employeeId)
    .then(employee=>{
      supervisorId=employee.supervisor;
      if (employee.supervisee.length>0){
         res.status(422).json({
          message:"Cannot remove employee ,there are supervisors under him"
        })
      }
      else{
        employee.remove()
          .then(result=>{
            if (!supervisorId){
              res.status(200).json({
                message:"success"
              })
            }
            else{
              Employee.findById(supervisorId)
                .then(supervisor=>{
                  supervisor.supervisee=supervisor.supervisee.filter(id=>id.toString()!==employeeId);
                  return supervisor.save()
                })
                .then(result=>{
                  res.status(200).json({
                    message:"success"
                  })
                })
            }
          })
          .catch(err=>{
            console.log(err);
            res.status(500).json({
              message:"Removing the employee failed"
            })
          })

      }
    })
    .catch(err=>{
      console.log(err);
    })
}

exports.postEditEmployees=(req,res,next)=>{
  const employeeId=req.body._id;
  const name=req.body.name;
  const email=req.body.email;
  const joinDate=req.body.joinDate;
  const dateOfBirth=req.body.dateOfBirth;
  const gender=req.body.gender;
  const supervisorEmail=req.body.supervisorEmail;
  let updatedEmployee;
  let supervisorId;

  Employee.findById(employeeId)
    .then(employee=>{
      updatedEmployee=employee;
      if (employee.supervisor){
        return Employee.findById(employee.supervisor)
          .then(supervisor=>{
            supervisor.supervisee=supervisor.supervisee.filter(eId=>{
              if (eId.toString()!==employeeId){
                return true;
              }
              return false;
            })
            return supervisor.save()
          })
      }
    })
    .then(result=>{
      if (supervisorEmail){
        return Employee.findOne({email:supervisorEmail})
          .then(supervisor=>{
            supervisorId=supervisor._id;
            supervisor.supervisee.push(employeeId);
            return supervisor.save()
          })
      }
    })
    .then(result=>{
      updatedEmployee.name=name;
      updatedEmployee.email=email;
      updatedEmployee.gender=gender;
      updatedEmployee.dateOfBirth=dateOfBirth;
      updatedEmployee.supervisor=(supervisorEmail)?supervisorId:null;
      return updatedEmployee.save();
    })
    .then(result=>{
      res.status(200).json({
        message:"Employee updated successfully"
      })
    })
    .catch(err=>{
        console.log(err.name);
        if (err.name==="TypeError"){
            res.status(422).json({
                message:"The supervisor does not exist"
            })
        }
        else {
            res.status(422).json({
                message:"The above email is not permitted"
            })
        }
    })

}
