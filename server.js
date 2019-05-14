const mongoose=require("mongoose");

const app=require("./backend/app");

const MONGOURI=
  "mongodb+srv://jagadeesh:Yuva12345@cluster0-ge9fd.mongodb.net/whisk?retryWrites=true";

const dbConfiguration={ useNewUrlParser: true, useCreateIndex: true };

mongoose.connect(MONGOURI,dbConfiguration)
  .then(result=>{
    app.listen(3000);
  })
  .catch(err=>{
    console.log(err);
  })


