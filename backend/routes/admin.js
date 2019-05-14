const express=require("express");

const adminController=require("../controllers/admin");

const router=express.Router();

// POST api/admin/add
router.post("/add",adminController.postAddEmployee);

// GET api/admin/employees
router.get("/employees",adminController.getEmployees);

// DELETE api/admin/remove/:id
router.delete("/remove/:id",adminController.postRemoveEmployees);

// POST api/admin/edit
router.post("/edit",adminController.postEditEmployees);

module.exports=router;
