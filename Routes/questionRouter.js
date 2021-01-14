const router = require('express').Router();
const questionModel = require('../schema').questionModel;
const {Controller} = require('../controllers/genericController');
const {questionController} = require("../controllers/questionController");
const query = require("querymen").middleware;

router.put("/question/:id", new questionController(questionModel).Update);
router.post("/question", new questionController(questionModel).Create);
router.delete("/question/:id", new questionController(questionModel).Delete);
router.get("/question/:id", new questionController(questionModel).GetElementById);
router.get("/question", query(), new questionController(questionModel).GetELement);

module.exports = router;