const jwt=require("jsonwebtoken");

module.exports=(userType)=>{
  return (req,res,next)=>{
    try{
      const token=req.headers.authorization.split(" ")[1];
      jwt.verify(token,`GSPANN_is_equal_to_WHISK_${userType}`);
      next();
    }
    catch (err) {
      res.status(401).json({
        message:"Auth failed"
      })
    }
  }
}
