const mongoose=require("mongoose");

const bcrypt=require("bcrypt");

const app=require("./app");
const Admin=require("./models/admin");

const MONGOURI=process.env.MONGO_URI;

const dbConfiguration={ useNewUrlParser: true, useCreateIndex: true };

mongoose.connect(MONGOURI,dbConfiguration)
  .then(result=>{
    app.listen(process.env.PORT ||3000);
    return Admin.findOne()
  })
  .then(admin=>{
    if (!admin){
      const password="admin";
      bcrypt.hash(password,12)
        .then(hashedPassword=>{
          const admin=new Admin({password:hashedPassword});
          return admin.save()
        })
        .catch(err=>{
          console.log(err);
        })
    }
  })
  .catch(err=>{
    console.log(err);
  })


