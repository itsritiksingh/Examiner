import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
import { Row, Col } from "antd";
import jwtDecode from "jwt-decode";
import {Navbar} from '../../components/navbar/navbar';
import { QuestionModel } from "../../components/showQuestionModel/QuestionModel";

export const Report = () => {
  const [report, setReport] = useState();
  const [modalvisible, setModalvisible] = useState(false);
  const [questionId, setQuestionId] = useState();

  useEffect(() => {
    axios
      .get("/user", {
        params: {
          search: "_id",
          q: jwtDecode(JSON.parse(localStorage.getItem("jwt")).ACCESS_TOKEN)
            ._id,
          fields: "reports",
          populate: "reports",
        },
      })
      .then((axiosdata) => setReport(axiosdata.data[0].reports));
  }, []);

  useEffect(() => {
    if (!report) return;
    
  }, [report]);

  return (
    <>
    <Navbar />
      {report && (
        <Row>
          <Col>
            <Chart
              width={"500px"}
              height={"300px"}
              chartType="PieChart"
              loader={<div>Loading Chart</div>}
              data={[
                ["Question", "Numbers"],
                ["IncorrectAnswer", report[0].incorrectAnswers.length],
                ["CorrectAnswer", report[0].correctAnswers.length],
              ]}
              options={{
                title: "Your last report",
              }}
              rootProps={{ "data-testid": "1" }}
            />
          </Col>
          <Col>
           {report[0].correctAnswers.length !=0 && <p>Correct Answer: </p>} 
            {report[0].correctAnswers.map((val, i) => (
              <a
                href="#"
                onClick={() => {
                  setQuestionId(val);
                  setModalvisible(true);
                }}
              >
                {`correct question : ${i + 1}`}
              </a>
            ))}
            <br />
            <p>Incorrect Answer: </p>
            <br />
            {report[0].incorrectAnswers.map((val, i) => (
              <>
              <a
                href="#"
                onClick={() => {
                  setQuestionId(val);
                  setModalvisible(true);
                }}
              >
                {`incorrect question : ${i + 1}`}
              </a>
              <br/>
              </>   
            ))}
            <br />
          </Col>
        </Row>
      )}
      { questionId && <QuestionModel modalvisible={modalvisible} _id={questionId} onCancel={()=> setModalvisible(false)} />}
    </>
  );
};
