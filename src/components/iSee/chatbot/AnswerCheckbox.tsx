import React from 'react';
import { Checkbox } from 'antd';

const AnswerCheckbox: React.FC = ({ listAnswer, onChange }) => {
  return (
    <Checkbox.Group>
      {listAnswer.map((element: any, idx: number) => (
        <Checkbox onChange={onChange} value={element.val} key={idx}>
          {element.val}
        </Checkbox>
      ))}
    </Checkbox.Group>
  );
};

export default AnswerCheckbox;
