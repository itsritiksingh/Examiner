const { Controller } = require("./genericController");

class userController extends Controller {
  constructor(model) {
    super(model);
    this.model = model;
  }

  //push _id(questionid) to array find by uploadedBy
  pushUpdate(req, res) {
    this.model
      .updateOne(
        { name: req.body.uploadedBy },
        { $push: { contributions: req.body._id } }
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
    this.model
      .updateOne(
        { name: req.body.uploadedBy },
        { $pull: { contributions: req.body._id } }
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

  //you need to pass querymen as middleware to this route
  //refer to npm querymen for urlquery
  //it has it own imlement for query you need to enter q as search string and
  //seach query into which attribute q will be searched
  GetELement(req, res) {
    if (Object.keys(req.querymen.select).length == 0) {
      req.querymen.select.password = 0;
    }

    this.model
      .find(
        { [req.query.search]: req.query.q },
        req.querymen.select,
        req.querymen.cursor
      )
      .populate(req.query.populate)
      .then((data) => res.json(data))
      .catch((err) => res.status(400).send(err));
  }
}

exports.userController = userController;
