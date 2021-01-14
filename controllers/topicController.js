const { Controller } = require('./genericController')

class userController extends Controller {
    constructor(model) {
        super(model);
        this.model = model;
    }

    //push _id(questionid) to array find by uploadedBy
    pushUpdate(req, res) {
        userModel
            .updateOne(
                { name: req.body.uploadedBy },
                { $push: { question: req.body._id } }
            )
            .then((response) => {
                res.send("Ok");
                console.log(response);
            })
            .catch((e) => {
                res.status(400).send(e);
                console.log(e);
            });
    }

        //pull _id(questionid) to array find by uploadedBy
        pullUpdate(req, res) {
            userModel
                .updateOne(
                    { name: req.body.uploadedBy },
                    { $pull: { question: req.body._id } }
                )
                .then((response) => {
                    res.send("Ok");
                    console.log(response);
                })
                .catch((e) => {
                    res.status(400).send(e);
                    console.log(e);
                });
        }
        

}

exports.userController = userController;