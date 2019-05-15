const express=require("express");

const authController=require("../controllers/auth");

const router=express.Router();

// POST /api/login
router.post("/login",authController.postLogin);

module.exports=router;
