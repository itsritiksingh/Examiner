const router = require('express').Router();
const {upload} = require('../controllers/upload');
const {removeUpload} = require('../controllers/upload');

router.post("/upload",upload);
router.post("/removeupload",removeUpload);

module.exports = router;