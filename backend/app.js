const express=require("express");
const bodyParser=require("body-parser");

const bypassCORS=require("./controllers/bypass");
const adminRoutes=require("./routes/admin");
const authRoutes=require("./routes/auth");
const employeeRoutes=require("./routes/employee");

const app=express();

app.use(bodyParser.json());

app.use(bypassCORS);

app.use("/api/admin",adminRoutes);

app.use("/api/employee",employeeRoutes);

app.use("/api",authRoutes);

module.exports=app;
