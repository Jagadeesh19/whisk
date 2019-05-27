const Employee=require("../models/employee");

exports.postApplyLeave=(req,res,next)=>{
  const leaveType=req.body.leaveType;
  const startDate=req.body.startDate;
  const endDate=req.body.endDate;
  const leaveDescription=req.body.leaveDescription;
  const employeeId=req.body.employeeId;
  const appliedDate=req.body.appliedDate;

  const leave={
    startDate:startDate,
    endDate:endDate,
    leaveDescription:leaveDescription,
    contactInfo: contactInfo,
    appliedDate: appliedDate
  };

  Employee.findById(employeeId)
    .then(employee=>{
      switch (leaveType) {
        case "loss of pay":
          if (employee.leaveBalances!==0) throw new Error("loss of pay not applicable, apply annual leave instead");
          employee.LOP.push(leave);
          break;
        case "Annual leave":
          if (employee.leaveBalances<=0) throw new Error("Annual leave is not applicable, apply loss of pay instead");
          employee.annual.push(leave);
          employee.leaveBalances--;
          break;
        case "Work from home":
          employee.WFH.push(leave);
          break;
        case "Comp off":
          if (employee.compOffBalances==0) throw new Error("permission denied: comp off is not applicable");
          employee.compOff.push(leave);
          break;
      }
      return employee.save();
    })
    .then(result=>{
      res.status(200).json({
        message:"Leave applied successfully"
      })
    })
    .catch(err=>{
      if (err instanceof Error){
        res.status(422).json({
          message:err.message
        })
      }
    })
}

exports.getLeaves=(req,res,next)=>{
  const employeeId=req.body.employeeId;
  const leaveType=req.body.leaveType;
  const year=req.body.year;
  const month=req.body.month;
  let leaves;

  Employee.findById(employeeId)
    .then(employee=>{
      switch (leaveType) {
        case "Annual leaves":
          leaves=employee.annual;
          break;
        case "Work from home":
          leaves=employee.WFH;
          break;
        case "Loss of Pay":
          leaves=employee.LOP;
          break;
        case "Comp off":
          leaves=employee.compOff;
          break;
      }

      const maxDate=new Date(year,(+month)+1,0);
      const minDate=new Date(year,+month,0);

      console.log(leaves,"what a mess");

      leaves=leaves.filter(leave=>{
        const startDate=leave.startDate;
        if (startDate>minDate && startDate<maxDate) return true;
        return false;
      })

      res.status(200).json({
        leaves:leaves
      })
    })
    .catch(err=>{
      console.log(err);
    })
}

exports.getDateOfJoin=(req,res,next)=>{
  const employeeId=req.params.employeeId;

  Employee.findById(employeeId)
    .then(employee=>{
      res.status(200).json({
        joinDate:employee.joinDate
      })
    })
}
