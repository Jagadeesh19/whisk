const express=require("express");

const adminController=require("../controllers/admin");
const checkAuth=require("../middleware/check-auth");

const router=express.Router();

// POST api/admin/add
router.post("/add",checkAuth("admin"),adminController.postAddEmployee);

// GET api/admin/employees
router.get("/employees",checkAuth("admin"),adminController.getEmployees);

// DELETE api/admin/remove/:id
router.delete("/remove/:id",checkAuth("admin"),adminController.postRemoveEmployees);

// POST api/admin/edit
router.post("/edit",checkAuth("admin"),adminController.postEditEmployees);

module.exports=router;
