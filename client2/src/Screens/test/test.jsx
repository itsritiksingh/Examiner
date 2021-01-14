import React, { useState } from "react";
import { Button } from "antd";
import { Testwidget } from "../../components/testwidget/testwidget";
import Countdown from "react-countdown";
import axios from "axios";
import { TestNavbar } from "../../components/testNavbar/TestNavbar";
import jwt_decode from "jwt-decode";
import { message } from "antd";

export const Test = () => {
  const [testScreen, setTestScreen] = useState("waiting"); //only waiting and testWidget

  function submitTest() {
    const id = jwt_decode(JSON.parse(localStorage.getItem("jwt")).ACCESS_TOKEN)
      ._id;
    const topicId = localStorage.getItem("testTopicId");
    axios
      .post(`/submitTest/${id}`, {
        response: JSON.parse(localStorage.getItem("test")),
        topicId,
      })
      .then(() => {
        window.location = "/result";
      })
      .catch((e) => {
        console.log(e);
        message.error("Test couldn't be submitted now");
      });
  }
  const Waiting = ({ setTestScreen }) => {
    return (
      <div
        style={{
          display:"flex",
         justifyContent:"center",
         alignItems:"center",
         height:"100vh"
        }}
      ><div className="div" style={{textAlign:"center"}}>
        <p>Prepare yourself for test and then click start now</p>
        <br/>
        <Button
          onClick={() => {
            setTestScreen("testWidget");
          }}
        >
          Start now
        </Button>
        <br/>
        <br/>

        <p>*you can click on image to zoom</p>
        </div>
      </div>
    );
  };
  const TestWidget = () => {
    return (
      <>
          <TestNavbar>
            <Countdown
              date={JSON.parse(localStorage.getItem("test")).startTime}
              onComplete={submitTest}
            />
            <Button type="danger" onClick={submitTest} style={{marginLeft:"5px"}}>
              Submit Test
            </Button>
          </TestNavbar>
          <Testwidget />
      </>
    );
  };

  return (
    <div>
      {testScreen === "waiting" ? (
        //loading screen
        <Waiting setTestScreen={setTestScreen} />
      ) : (
        <TestWidget />
      )}
    </div>
  );
};
