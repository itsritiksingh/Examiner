const router = require('express').Router();
const topicModel = require('../schema').topicModal;
const {Controller} = require('../controllers/genericController');
const query = require("querymen").middleware;

router.put("/topic/:id", new Controller(topicModel).Update);
router.post("/topic", new Controller(topicModel).Create);
router.delete("/topic/:id", new Controller(topicModel).Delete);
router.get("/topic/:id", new Controller(topicModel).GetElementById);
router.get("/topic", query(), new Controller(topicModel).GetELement);

module.exports = router;