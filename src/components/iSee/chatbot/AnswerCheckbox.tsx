import React from 'react';
import { Checkbox } from 'antd';

const AnswerCheckbox: React.FC<{
  listAnswer: string[];
  onChange: (options: any) => void;
}> = ({ listAnswer, onChange }) => {
  return (
    <Checkbox.Group onChange={onChange}>
      {listAnswer.map((element: any, idx: number) => (
        <Checkbox value={element.val} key={idx}>
          {element.val}
        </Checkbox>
      ))}
    </Checkbox.Group>
  );
};

export default AnswerCheckbox;
