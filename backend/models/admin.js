const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const adminSchema=new Schema({
    username:{
        type: String,
        required:true,
        default: "admin"
    },
    password:{
        type: String,
        required: true,
    },
    email:{
        type:String,
        default: "",
        required:true
    }
})

module.exports=mongoose.model("Admin",adminSchema);
