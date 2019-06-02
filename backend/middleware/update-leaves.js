const Employee=require("../models/employee");

module.exports=(req,res,next)=>{
  const employeeId=req.body.employeeId;

  Employee.findById(employeeId)
    .then(employee=>{
      let leavesCount=0;
      for (let leave of employee.annual){
        leavesCount+=leave.days;
      }
      let leaveBalances;
      const joinDate=employee.joinDate;
      const currentDate=new Date();
      const nofdays=Math.ceil((currentDate-joinDate)/(3600000*24));
      const nofMonths=Math.ceil(nofdays/30);
      leaveBalances=2*nofMonths;
      leaveBalances-=leavesCount;
      employee.leaveBalances=leaveBalances;
      return employee.save();
    })
    .then(result=>{
      next();
    })
    .catch(err=>{
      console.log(err);
    })
}
