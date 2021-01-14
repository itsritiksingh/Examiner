const fs = require('fs');

 class Controller {
  constructor(model){
    this.model = model;
    this.Create = this.Create.bind(this);
    this.Delete = this.Delete.bind(this);
    this.pushUpdate = this.pushUpdate.bind(this);
    this.Update = this.Update.bind(this);
    this.GetElementById = this.GetElementById.bind(this);
    this.GetELement = this.GetELement.bind(this);
  }
  
    // POST	/{content-type}	Create a {content-type} entry
    Create(req, res) {
      new this.model(req.body)
        .save()
        .then((data) => res.json(data))
        .catch((err) => res.status(400).send(err));
    }

    // DELETE	/{content-type}/:id	 Delete a {content-type} entry
    Delete(req, res) {
      this.model
        .deleteOne({ _id: req.params.id })
        .then((data) => res.json(data))
        .catch((err) => res.status(400).send(err));
    }

  //PUT	/{content-type}/:id	Update a {content-type} entry
  //to pushinto an array
  //@body : {attributename: data to push}
   pushUpdate(req, res) {
    this.model
      .updateOne({ _id: req.params.id }, { $push: req.body })
      .then((data) => res.json(data))
      .catch((err) => res.status(400).send(err));
  }

//PUT	/{content-type}/:id	Update a {content-type} entry
  //to pushinto an array
  //@body : {attributename: data to pull}
  pullUpdate(req, res) {
    this.model
      .updateOne({ _id: req.params.id }, { $pull: req.body })
      .then((data) => res.json(data))
      .catch((err) => res.status(400).send(err));
  }

    //PUT	/{content-type}/:id	Update a {content-type} entry
     Update(req, res) {
      this.model
        .updateOne({ _id: req.params.id }, { $set: req.body })
        .then((data) => res.json(data))
        .catch((err) => res.status(400).send(err));
    }
  
    //GET	/{content-type}/:id	Get a specific {content-type} entry
     GetElementById(req, res) {
      this.model
        .findOne({ _id: req.params.id })
        .then((data) => res.send(data))
        .catch((err) => res.status(400).send(err));
    }
  
    //you need to pass querymen as middleware to this route
    //refer to npm querymen for urlquery
    //it has it own imlement for query you need to enter q as search string and
    //seach query into which attribute q will be searched
     GetELement(req, res) {
      this.model
        .find({[req.query.search]: req.query.q}, req.querymen.select, req.querymen.cursor)
        .populate(req.query.populate)
        .then((data) => res.json(data))
        .catch((err) => res.status(400).send(err));
    }

}

exports.Controller = Controller;

// exports.Controller = (model) => {
//   // POST	/{content-type}	Create a {content-type} entry
//   function Create(req, res) {
//     console.log(req.body)
//     new model(req.body)
//       .save()
//       .then((data) => res.json(data))
//       .catch((err) => res.status(400).send(err));
//   }

//   // DELETE	/{content-type}/:id	 Delete a {content-type} entry
//   function Delete(req, res) {
//     model
//       .deleteOne({ _id: req.params.id })
//       .then((data) => res.json(data))
//       .catch((err) => res.status(400).send(err));
//   }

//   // //Delete /{content-type}/:id?fields	 Delete a {content-type} entry
//   // //and delete any uploaded content in it
//   // //you need to pass querymen as middleware to this route
//   // function DeleteEntryAndContent(req,res){
//   //   model.findOne({ _id: req.params.id },req.querymen.select)
//   //   .then((data) => {
//   //     for(var _data in data){
//   //       //check if _data is an array
//   //       if(typeof _data === "object"){
//   //         for(var _data_content of _data){
//   //           //catch if data is already been deleted
//   //           fs.unlink(fs.join(".."+"public"+_data_content)).catch();
//   //         }
//   //       }else {
//   //         //if _data is not an array
//   //         fs.unlink(fs.join(".."+"public"+_data)).catch();
//   //       }
//   //     }

//   //   })
//   // }

//     //PUT	/{content-type}/:id	Update a {content-type} entry
//   //to pushinto an array
//   //@body : {attributename: data to push}
//   function pushUpdate(req, res) {
//     model
//       .updateOne({ _id: req.params.id }, { $push: req.body })
//       .then((data) => res.json(data))
//       .catch((err) => res.status(400).send(err));
//   }

//   //PUT	/{content-type}/:id	Update a {content-type} entry
//   function Update(req, res) {
//     model
//       .updateOne({ _id: req.params.id }, { $set: req.body })
//       .then((data) => res.json(data))
//       .catch((err) => res.status(400).send(err));
//   }

//   //GET	/{content-type}/:id	Get a specific {content-type} entry
//   function GetElementById(req, res) {
//     model
//       .findOne({ _id: req.params.id })
//       .then((data) => res.send(data))
//       .catch((err) => res.status(400).send(err));
//   }

//   //you need to pass querymen as middleware to this route
//   //refer to npm querymen for urlquery
//   //it has it own imlement for query you need to enter q as search string and
//   //seach query into which attribute q will be searched
//   function GetELement(req, res) {
//     console.log({[req.query.search]:req.querymen.query.keywords}, req.querymen.select, req.querymen.cursor);
//     model
//       .find({[req.query.search]: req.query.q}, req.querymen.select, req.querymen.cursor)
//       .populate(req.query.populate)
//       .then((data) => res.json(data))
//       .catch((err) => res.status(400).send(err));
//   }
//   return {Create,Delete,Update,GetELement,GetElementById,pushUpdate}
// };
