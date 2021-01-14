require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const AdminBro = require("admin-bro");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const AdminBroExpress = require("@admin-bro/express");
const AdminBroMongoose = require("@admin-bro/mongoose");
const uploadFeature = require("@admin-bro/upload");
const { BaseProvider } = require("@admin-bro/upload");
const {Storage} = require("@google-cloud/storage");
const storage = new Storage();
const userModel = require("./schema").userModel;
const topicModal = require("./schema").topicModal;
const questionModel = require("./schema").questionModel;
const reportModel = require("./schema").reportModel;
const userRouter = require("./Routes/userRouter");
const topicRouter = require("./Routes/topicRoutes");
const questionRouter = require("./Routes/questionRouter");
const utilRouter = require("./Routes/utilRouter");

mongoose
  .connect(
    "mongodb+srv://root:root@cluster0-zcmfs.mongodb.net/examiner?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("mongoose connected"))
  .catch((e) => console.log(e));

const PORT = process.env.PORT || 5000;
AdminBro.registerAdapter(AdminBroMongoose);

var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "*");

  next();
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(allowCrossDomain);
app.use(userRouter);
app.use(topicRouter);
app.use(questionRouter);
app.use(utilRouter);
app.use(express.static("views"));
app.use(express.static(path.resolve(__dirname, "client2", "build")));


class MyProvider extends BaseProvider {
  constructor(bucketname) {
    super(bucketname);
    this.bucket = bucketname;
    this.expires = 0 //file never expires
  }

   async upload(file, key) {
    return storage.bucket(this.bucket).upload(file.path, {
      gzip: true,
      destination: key,
      predefinedAcl: this.expires === 0 ? 'publicRead' : 'private',
    })
  }

   async delete(key, bucket){
    const gcpBucket = storage.bucket(bucket)
    const file = gcpBucket.file(key)
    return file.delete()
  }

   async path(key, bucket) {
    const gcpBucket = storage.bucket(bucket)
    const file = gcpBucket.file(key)

    if (this.expires) {
      const files = await file.getSignedUrl({
        action: 'read',
        expires: new Date().valueOf() + this.expires * 1000,
      })
      return files[0]
    }
    // https://cloud.google.com/storage/docs/access-public-data#api-link
    return `https://storage.googleapis.com/${bucket}/${key}`
  }
}

const adminBro = new AdminBro({
  resources: [
    {
      resource: userModel,
    },
    {
      resource: topicModal,
    },
    {
      resource: questionModel,
      options: {
        properties: {
          questionImageLink: { isVisible: false },
          answerImageLink: { isVisible: false },
        },
      },
      features: [
        uploadFeature({
          provider: new MyProvider("examiner"),
          properties: {
            key: "questionImageLink",
            file: "question image link",
            filePath: "randon string 1",
            filesToDelete: "random string 2",
          },
        }),
        uploadFeature({
          provider: new MyProvider("examiner"),
          properties: {
            key: "answerImageLink",
            file: "answer image link",
            filePath: "answer image",
            filesToDelete: "answerImage lInk toDelete",
          },
        }),
      ],
    },
    {
      resource: reportModel,
    },
  ],
  rootPath: "/admin",
});
const router = AdminBroExpress.buildRouter(adminBro);
app.use(adminBro.options.rootPath, router);

function checkToken(req, res, next) {
  var { access_token, refresh_token } = req.headers;
  if (!access_token || !refresh_token) res.redirect("/");

  //check access token first
  jwt.verify(access_token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) console.log(err);

    //then if access token expired check refresh token instead.
    if (!user) {
      jwt.verify(refresh_token, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) res.redirect("/");
        if (!user) return res.redirect("/");

        //if refresh token verified issue new access token
        access_token = jwt.sign(user, process.env.ACCESS_TOKEN, {
          expiresIn: 3600,
        });
        res.set("access_token", access_token);
        next();
      });
    } else {
      next();
    }
  });
}

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  userModel.findOne({ email }).then((response) => {
    if (!response) return res.status(403).send();

    bcrypt.compare(password, response.password).then((matched) => {
      if (!matched) return res.status(401).send();
      jwt.sign(
        { email, _id: response._id },
        process.env.ACCESS_TOKEN,
        (err, token) => {
          if (err) res.status(500).send(err);
          jwt.sign(
            { email, _id: response._id },
            process.env.REFRESH_TOKEN,
            (err, REFRESH_TOKEN) => {
              res.send({
                name: response.name,
                ACCESS_TOKEN: token,
                REFRESH_TOKEN,
              });
            }
          );
        }
      );
    });
  });
});

app.post("/testByTopic/:topicId", checkToken, (req, res) => {
  const { testDuration, userId } = req.body;
  const topicId = req.params.topicId;

  // questionModel.find({ topicId, uploadedBy: { $ne: userId } }, { correctAnswer: 0 }).then((response) => {
  questionModel.find({ topicId }, { correctAnswer: 0 }).then((response) => {
    //random number for questions.
    var currentIndex = response.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = response[currentIndex];
      response[currentIndex] = response[randomIndex];
      response[randomIndex] = temporaryValue;
    }

    const hoursInMilli = testDuration.split(":")[0] * 60 * 60 * 1000;
    const minInMilli = testDuration.split(":")[1] * 60 * 1000;
    const startTime = Date.now() + hoursInMilli + minInMilli;

    res.send({
      startTime,
      totQues: response.length,
      response,
    });
  });
});

//todo
app.post("/submitQuestion", checkToken, (req, res) => {
  const { questionId, answerChoice, userName } = req.body;

  //update answeredObj
  questionModel.findOne({ _id: questionId }).then((question) => {
    if (question.answeredObj) question.answeredObj[userName] = answerChoice;
    else {
      question.answeredObj = {};
      question.answeredObj[userName] = answerChoice;
    }

    questionModel
      .updateOne(
        { _id: questionId },
        { $set: { answeredObj: question.answeredObj } }
      )
      .then((response) => {
        res.send(response);
        reportModel
          .findOne({ topicId: question.topicId, userName })
          .then((report) => {
            if (report === null) {
              //create new Report
              var incorrectAnswers = [];
              var correctAnswers = [];

              if (question.correctAnswer === answerChoice) {
                incorrectAnswers.push(questionId);
              } else {
                correctAnswers.push(questionId);
              }

              const tempReport = new reportModel({
                userName,
                topicId: question.topicId,
                incorrectAnswers,
                correctAnswers,
              });

              tempReport
                .save()
                .then((res) => {
                  console.log(res);
                })
                .catch((e) => console.log(e));
            } else {
              //append in previous report
              question.correctAnswer === answerChoice
                ? report.incorrectAnswers.push(questionId)
                : report.correctAnswers.push(questionId);

              reportModel
                .updateOne(
                  { topicId: question.topicId, userName },
                  {
                    $set: {
                      incorrectAnswers: report.incorrectAnswers,
                      correctAnswers: report.correctAnswers,
                    },
                  }
                )
                .then((res) => console.log(res))
                .catch((e) => console.log(e));
            }
          });
      })
      .catch((e) => {
        res.status(400).send(e);
        console.log(e);
      });
  });
});

app.post("/getReports", checkToken, (req, res) => {
  const { topicId } = req.body;
  reportModel
    .find({ topicId })
    .then((response) => res.send(response))
    .catch((e) => {
      res.status(400).send(e);
      console.log(e);
      add;
    });
});

app.post("/submitTest/:userId", checkToken, async (req, res) => {
  const { response, topicId } = req.body;
  console.log(response);
  const userId = req.params.userId;
  if (!response) return;

  let totalQuestion = response.length,
    totalAnswered = 0,
    incorrectAnswers = [],
    correctAnswers = [];

  for (var i = 0; i < response.length; i++) {
    if (!response[i].expectedAnswer) {
      incorrectAnswers.push(response[i]._id);
      continue;
    }
    totalAnswered += 1;
    await questionModel
      .findOne({ _id: response[i]._id })
      .then((question) => {
        if (
          question.correctAnswer.toLowerCase() ===
          response[i].expectedAnswer.toLowerCase()
        ) {
          correctAnswers.push(response[i]._id);
        } else incorrectAnswers.push(response[i]._id);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  new reportModel({
    topicId,
    totalQuestion,
    totalAnswered,
    incorrectAnswers,
    correctAnswers,
    userId,
  })
    .save()
    .then((result) => {
      userModel
        .updateOne({ _id: userId }, { $push: { reports: result._id } })
        .then(() => {
          res.send(result);
        });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send(e);
    });
});

//dependencies Link
app.post("/addUser", checkToken, (req, res) => {
  const { name } = req.body;
  const tempUser = new userModel({
    name,
  });
  tempUser.save().then((resa) => console.log(resa));
});

app.get("*",(req,res)=>{
  res.sendFile(path.resolve(__dirname, "client2", "build", "index.html"));
})

app.listen(PORT, () => {
  console.log("server started");
});
