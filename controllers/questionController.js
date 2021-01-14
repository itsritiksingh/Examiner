const {Controller} = require('./genericController')
const {userModel} = require("../schema");
const {userController} = require('./userController');

class questionController extends Controller{
    constructor(model){
        super(model) ;
        this.model = model;
    }

    Create(req,res) {
        const newQuestion = this.model({
            ...req.body
        });
        newQuestion.save().then((ques) => {
            req.body.uploadedBy = ques.uploadedBy;
            req.body.id = ques._id;
           new userController(userModel).pushUpdate(req,res);
           new userController(userModel).pushUpdate(req,res);
        });
    }
    Delete(req,res){
        this.model
        .deleteOne({ _id: req.params.id })
        .then((data) => {
            req.body.uploadedBy = ques.uploadedBy;
            req.body.id = ques._id; 
            new userController(userModel).pullUpdate(req,res);
            res.json(data);})
        .catch((err) => res.status(400).send(err));
        
    }
}
exports.questionController = questionController;