const express=require("express");

const authController=require("../controllers/auth");

const router=express.Router();

// POST /api/login
router.post("/login",authController.postLogin);

// POST /api/reset
router.post("/reset",authController.postReset);

// POST /api/valid-token
router.post("/valid-token",authController.postValidToken);

// POST /api/new-password
router.post("/new-password",authController.postNewPassword);

module.exports=router;
