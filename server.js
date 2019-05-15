const mongoose=require("mongoose");

const bcrypt=require("bcrypt");

const app=require("./backend/app");
const Admin=require("./backend/models/admin");

const MONGOURI=
  "mongodb+srv://jagadeesh:Yuva12345@cluster0-ge9fd.mongodb.net/whisk?retryWrites=true";

const dbConfiguration={ useNewUrlParser: true, useCreateIndex: true };

mongoose.connect(MONGOURI,dbConfiguration)
  .then(result=>{
    app.listen(3000);
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


