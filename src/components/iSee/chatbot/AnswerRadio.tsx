import React from 'react';
import { Radio } from 'antd';

const AnswerRadio = ({ listAnswer, /* onClick */ onChange }) => {
  const [value, setValue] = React.useState();

  const isChanged = (e) => {
    setValue(e.target.value);
  };

  return (
    <div>
      <Radio.Group onChange={isChanged} value={value}>
        {listAnswer.map((element: any, idx: number) => (
          <Radio
            /* onClick={onClick} */ onChange={onChange}
            value={element.val}
            key={'radio' + idx}
          >
            {element.val}
          </Radio>
        ))}
      </Radio.Group>
    </div>
  );
};

export default AnswerRadio;
