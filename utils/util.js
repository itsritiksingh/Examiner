const crypto = require("crypto"); // randomBytes;
const path = require("path");
const fs = require("fs");

module.exports = upload = (req, res, next) => {
    var restData = {};
    req.busboy.on("file", (fieldName, file, filename) => {
      const rand = crypto.randomBytes(2).toString("hex");
      var saveTo = path.join("views", "upload", rand + filename);
      restData[fieldName] = saveTo;
      console.log("Uploading: " + saveTo);
      file.pipe(fs.createWriteStream(saveTo));
    });
  
    req.busboy.on("field", function (key, value) {
      restData[key] = value;
    });
  
    req.busboy.on("finish", () => {
      req.body = restData;
      next();
    });
    return req.pipe(req.busboy);
  };