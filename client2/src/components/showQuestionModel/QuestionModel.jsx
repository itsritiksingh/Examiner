import React, { useEffect, useState } from "react";
import { Col, Modal, Row ,Image} from "antd";
import axios from "axios";

export const QuestionModel = ({ _id,modalvisible,onCancel }) => {
  const [question, setQuestion] = useState();
  useEffect(() => {
    axios
      .get(`/question/${_id}`)
      .then((axiosRes) => setQuestion(axiosRes.data));
  }, [_id]);

  return (
    <Modal onCancel={onCancel} visible={modalvisible} okButtonProps={{disabled: true}} >
      <Row>
        {question && 
        <Col>
          <Image src={"/" + question.questionImageLink} />
          <Image src={"/" + question.answerImageLink} />
          <br/>
          <p>{question.correctAnswer}</p>
        </Col>
        }
      </Row>
    </Modal>
  );
};
