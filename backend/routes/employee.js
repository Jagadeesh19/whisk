const express=require("express");

const employeeController=require("../controllers/employee");
const checkAuth=require("../middleware/check-auth");
const updateLeaves=require("../middleware/update-leaves");

const router=express.Router();

// POST /api/employee/apply-leave
router.post("/apply-leave",checkAuth("employee"),updateLeaves,employeeController.postApplyLeave);

module.exports=router;
