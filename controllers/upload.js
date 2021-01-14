const Busboy = require("busboy");
const path = require("path");
var rimraf = require("rimraf");
const fs = require("fs");
const rand = require("crypto").randomBytes;
const { Storage } = require("@google-cloud/storage");
const myBucket = new Storage().bucket("examiner");

exports.localStorageupload = (req, res) => {
  let fileuuid = rand(8).toString("hex");
  fs.mkdirSync(path.join(".", "views", fileuuid), { recursive: true });
  let _filename;
  var busboy = new Busboy({ headers: req.headers });
  busboy.on("file", function (fieldname, file, filename) {
    var saveTo = path.join(".", "views", fileuuid, filename);
    file.pipe(fs.createWriteStream(saveTo));
    _filename = filename;
  });
  busboy.on("finish", function () {
    res.send({ key: fileuuid + "/" + _filename });
  });
  return req.pipe(busboy);
};
exports.localStorageremoveUpload = (req, res) => {
  const { key } = req.body;
  rimraf(path.join(".", "views", key.split("/")[0]), () => {
    return res.send("Ok");
  });
};

//upload to gcp
exports.upload = (req, res) => {
  let fileuuid = rand(8).toString("hex");
  // fs.mkdirSync(path.join(".","views",fileuuid),{recursive:true});
  let _filename;
  var busboy = new Busboy({ headers: req.headers });
  busboy.on("file", function (fieldname, originalfile,filename) {
    const file = myBucket.file(fileuuid+"/"+ filename);

    // var saveTo = path.join('.', "views",fileuuid, filename);
    originalfile.pipe(
      file.createWriteStream({
        gzip: true,
        //destination does not work 
        destination: fileuuid,
        predefinedAcl: "publicRead",
      })
    );
    _filename = filename;
  });
  busboy.on("finish", function () {
    res.send({ key: fileuuid + "/" + _filename });
  });
  return req.pipe(busboy);
};

//remove from gcp
exports.removeUpload = (req, res) => {
  const { key } = req.body;
  return myBucket.file(key).delete();
};
