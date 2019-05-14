const express=require("express");
const bodyParser=require("body-parser");

const bypassCORS=require("./controllers/bypass");
const adminRoutes=require("./routes/admin");

const app=express();

app.use(bodyParser.json());

app.use(bypassCORS);

app.use("/api/admin",adminRoutes);

module.exports=app;
