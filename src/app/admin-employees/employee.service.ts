export class EmployeeService {
  private employees=[];

  getEmployee(id:string){
    const employee=this.employees.find(
      (item)=>{
        return item._id==id;
      }
    )
    return employee;
  }

  initialize(employees){
    this.employees=employees;
  }

  parseJsonDate(isoEncodedDate:string){
    const str=isoEncodedDate.split(/\D+/);
    return new Date(+str[0],+str[1]-1,+str[2]);
  }

}
