const express=require("express");

const employeeController=require("../controllers/employee");
const checkAuth=require("../middleware/check-auth");
const updateLeaves=require("../middleware/update-leaves");

const router=express.Router();

// POST /api/employee/apply-leave
router.post("/apply-leave",checkAuth("employee"),updateLeaves,employeeController.postApplyLeave);

// GET /api/employee/leaves
router.post("/leaves",checkAuth("employee"),updateLeaves,employeeController.getLeaves);

// GET /api/employee/join-date/:employeeId
router.get("/join-date/:employeeId",checkAuth("employee"),employeeController.getDateOfJoin);

module.exports=router;
