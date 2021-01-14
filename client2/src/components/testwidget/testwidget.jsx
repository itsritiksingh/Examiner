import React, { useEffect, useState } from "react";
import { Row, Col, Select, Button,Image } from "antd";
const { Option } = Select;

export const Testwidget = () => {
  const [testData, setTestData] = useState();
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    setTestData(JSON.parse(localStorage.getItem("test")).response);
  }, []);
  return (
    <>
      <Row justify="center">
        <Col span={{lg:16,sm: 24}}>{testData && renderQuestion(testData[idx])}</Col>
      </Row>
    </>
  );
  function renderQuestion(question) {
    return (
      <>
      <p>Question: </p>
        <Image width={300} src={"/" + question.questionImageLink} />
        <br/>
        <p>Answer: </p>
        <Image width={300} src={"/" + question.answerImageLink} />
        <br/>
        <br/>
        <p>Choices:</p>
        {question.expectedAnswer && <p>You previously selected: {question.expectedAnswer}</p>}
        <Select defaultValue={question.expectedAnswer} onChange={selectChoices}>
          <Option value="a">A</Option>
          <Option value="b">B</Option>
          <Option value="c">C</Option>
          <Option value="d">D</Option>
        </Select>
        <br/>
        <br/>
        <Button onClick={() => {idx === testData.length -1 ? setIdx(0) : setIdx(idx + 1)}}>Next</Button>
        <Button onClick={() => {idx === 0 ? setIdx(testData.length -1) : setIdx(idx - 1)}}>Previous</Button>
      </>
    );
  }
  function selectChoices(value) {
    testData[idx].expectedAnswer = value;
    localStorage.setItem("test", JSON.stringify(testData));
  }
};
