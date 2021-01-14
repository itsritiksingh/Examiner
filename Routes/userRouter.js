const router = require('express').Router();
const userModel = require('../schema').userModel;
const {Controller} = require('../controllers/genericController');
const {userController} = require("../controllers/userController");
const query = require("querymen").middleware;
const bcrypt = require('bcrypt');

//remove password
function addSelect(req,res,next){
    req.querymen.select.password=0;
    next();
}
function hashpassword(req,res,next){
    req.body.password = bcrypt.hashSync(req.body.password,10);
    next();
 }

router.put("/user/:id", new Controller(userModel).Update);
router.post("/user", hashpassword,new Controller(userModel).Create);
router.delete("/user/:id", new Controller(userModel).Delete);
router.get("/user/:id",addSelect, new Controller(userModel).GetElementById);
router.get("/user" ,query() , new userController(userModel).GetELement);
router.post("/user/contribution/:id",new userController(userModel).pushUpdate);
router.delete("/user/contribution/:id",new userController(userModel).pullUpdate);

module.exports = router;