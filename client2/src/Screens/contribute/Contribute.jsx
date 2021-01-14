import React, { useEffect, useState } from "react";
import { Row, Col, message, Upload, Button, Input, Select } from "antd";
import axios from "axios";
import {Navbar} from "../../components/navbar/navbar";
import { UploadOutlined } from "@ant-design/icons";
import jwt_decode from "jwt-decode";
const { Option } = Select;

export const Contribute = () => {
  const [topicname, setTopicName] = useState();
  let [uploaded, setUploaded] = useState([]);
  let [ansuploaded, ansSetUploaded] = useState([]);
  const [correctAnswer, setcorrectChoice] = useState();
  const [selectTopic, setSelectTopic] = useState("");

  useEffect(() => {
    axios
      .get("/topic", { params: { fields: "name" } })
      .then((res) => {
        setTopicName(res.data);
        console.log(res.data);
      })
      .catch((e) => {
        message.error("server error");
        console.log(e);
      });
  }, []);

  function questionRemove(file) {
    axios
      .post("/removeupload", {
        key: file.originFileObj.key,
      })
      .then(() => {
        var start = uploaded.indexOf(file.originFileObj.key);
        uploaded.splice(start, 1);
        setUploaded(uploaded);
      })
      .catch((e) => console.log(e));
  }
  function answerRemove(file) {
    axios
      .post("/removeupload", {
        key: file.originFileObj.key,
      })
      .then(() => {
        var start = uploaded.indexOf(file.originFileObj.key);
        uploaded.splice(start, 1);
        setUploaded(uploaded);
      })
      .catch((e) => console.log(e));
  }

  const props = {
    name: "file",
    beforeUpload: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      axios
        .post("/upload", formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((res) => {
          message.success(`file uploaded successfully`);
          file.key = res.data.key;

          //upload only one file
          if (uploaded.length > 0) questionRemove(file);

          uploaded = [file.key];
          setUploaded(uploaded);
        })
        .catch((e) => {
          console.log(e);
          message.error(`file upload failed.`);
        });

      return false;
    },
    onRemove: questionRemove,
  };
  const answerprops = {
    name: "file",
    beforeUpload: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      axios
        .post("/upload", formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((res) => {
          message.success(`file uploaded successfully`);
          file.key = res.data.key;

          //upload only one file
          if (ansuploaded.length > 0) ansSetUploaded(file);

          ansuploaded = [file.key];
          ansSetUploaded(ansuploaded);
        })
        .catch((e) => {
          console.log(e);
          message.error(`file upload failed.`);
        });

      return false;
    },
    onRemove: answerRemove,
  };

  function submitQues() {
    const uploadedBy = jwt_decode(
      JSON.parse(localStorage.getItem("jwt")).ACCESS_TOKEN
    )._id;
    const questionImageLink = uploaded.pop();
    const answerImageLink = ansuploaded.pop();
    if (correctAnswer === null || selectTopic === "") {
      message.error("Enter Choice");
      return;
    }

    axios
      .post("/question", {
        uploadedBy,
        questionImageLink,
        answerImageLink,
        correctAnswer,
        topicId: selectTopic,
      })
      .then((res) => {
        message.success("Successfully uploaded");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((e) => {
        message.error("server error");
        console.log(e);
      });
  }

  return (
    <>
    <Navbar />
      <Row justify="center">
        <Col>
          {topicname && (
            <>
            <br/>
            <p  >Topic Name :</p>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Topic name"
                onChange={(val) => {
                  setSelectTopic(val);
                }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
              >
                {topicname.map((i) => (
                  <Option value={i._id}>{i.name}</Option>
                ))}
              </Select>
              <br />
              <br/>
              <p>Question Image :</p>
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
              <br />
              <p>Answer Image :</p>
              <Upload {...answerprops}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
              <br />
              <p>Correct Answer :</p>
              <Input
                placeholder="Correct Option"
                onChange={(e) => {
                  setcorrectChoice(e.target.value);
                }}
              ></Input>
              <br/>
              <br/>
              <Button onClick={submitQues} type="primary" shape="round">Submit Question</Button>
            </>
          )}
        </Col>
      </Row>
    </>
  );
};
