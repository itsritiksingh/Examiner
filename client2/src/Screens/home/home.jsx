import React, { useEffect, useState } from "react";
import axios from "axios";
import { message, Form, TimePicker, Input, Modal } from "antd";
import {Navbar} from '../../components/navbar/navbar';
import { SimpleCard } from "../../components/simpleCard/SimpleCard";
import jwt_decode from "jwt-decode";

export const Home = () => {
  const [topic, setTopic] = useState();
  const [modalData, setModalData] = useState();
  const [modalvisible, setModalvisible] = useState(false);
  const [testDuration, setTestDuration] = useState();
  const [form] = Form.useForm();

  useEffect(() => {
    axios
      .get("/topic")
      .then((data) => setTopic(data.data))
      .catch((e) => message.error("Fetch error"));
  }, []);

  function handleCardClick(i) {
    setModalData(i);
    setModalvisible(true);
  }

  function modal() {
    return (
      <Modal
        title="Create test"
        visible={modalvisible}
        onOk={() => {
          form.validateFields().then((values) => {
            values.testDuration = testDuration;
            //topic Id is modal._id
            values.userId = jwt_decode(
              JSON.parse(localStorage.getItem("jwt")).ACCESS_TOKEN
            )._id;
            axios
              .post(`/testByTopic/${modalData._id}`, values)
              .then((test) => {
                localStorage.setItem("test", JSON.stringify(test.data));
                localStorage.setItem("testTopicId", modalData._id);
                window.location.href = "/test";
              })
              .catch((e) => message.error("Test couldn't be created now!"));
          });
        }}
        onCancel={() => {
          setModalvisible(false);
        }}
      >
        <p>Due want to start your test now</p>

        <p><b>Topic Name</b> - {modalData.name}</p>
        <Form form={form} layout="vertical">
          <Form.Item
            name="totalQuestion"
            label="total number of question"
            rules={[
              {
                required: true,
                message: "Please input the Number of Question!",
              },
            ]}
          >
            <Input type="number" min={1} defaultValue={1} />
          </Form.Item>
          <Form.Item name="description" label="Duration">
            <TimePicker
              format="hh:mm"
              onChange={(time, timestamp) => setTestDuration(timestamp)}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  return (
    <>
      <div className="padding">
        <Navbar />
        {topic &&
          topic.map((i, idx) => (
            <SimpleCard
              onClick={() => handleCardClick(i)}
              title={i.name}
              index={idx}
              totalQuestion="20"
            />
          ))}
        {modalData && modal()}
      </div>
    </>
  );
};
