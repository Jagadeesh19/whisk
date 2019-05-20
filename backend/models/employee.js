const mongoose=require("mongoose");
const uniqueValidator=require("mongoose-unique-validator");

const Schema=mongoose.Schema;

const leaveStructure={
  startDate:{
    type:Date,
    required: true
  },
  endDate:{
    type:String,
    required:true
  },
  leaveDescription:{
    type:String,
    required:true
  },
  leaveStatus:{
    type:String,
    required:true,
    default:"Not accepted"
  },
  contactInfo:{
    type:String,
    required: true
  }
}

const employeeSchema=new Schema({
    email: {
        type: String,
        required: true,
        unique:true
    },
    password:{
        type: String,
        required: true
    },

    name:{
        type: String,
        required: true
    },

    supervisor: {
        type: Schema.Types.ObjectId,
        ref:"Employee"
    },
    supervisee:{
        type: [Schema.Types.ObjectId],
        ref:"Employee",
        default:[]
    },
    joinDate:{
        type: Date,
        required:true
    },
    leaveBalances:{
        type:Number,
      required:true,
        default: 2
    },
    gender:{
      type:String,
      required: true
    },
    dateOfBirth:{
        type: Date,
        required: true
    },
    WFH:{
        type:[leaveStructure],
        required:true,
        default: []
    },
    annual:{
      type:[leaveStructure],
      required:true,
      default:[]
    },
    LOP:{
        type:[leaveStructure],
        required:true,
        default:[]
    },
    compOff:{
        type: [leaveStructure],
        required:true,
        default: []
    },
    resetToken:String,
    resetTokenExpiration:Date
})

employeeSchema.plugin(uniqueValidator);

module.exports=mongoose.model("Employee",employeeSchema);
