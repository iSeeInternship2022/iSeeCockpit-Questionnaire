import React from 'react';
import { Radio, Space } from 'antd';

const AnswerRadio = ({ listAnswer, onChange }) => {
  const [value, setValue] = React.useState();

  const isChanged = (e) => {
    setValue(e.target.value);
  };

  return (
    <div>
      <Radio.Group onChange={isChanged} value={value}>
        <Space size={20}>
          {listAnswer.map((element: any, idx: number) => (
            <Radio.Button onChange={onChange} value={element.val} key={'radio' + idx}>
              {element.val}
            </Radio.Button>
          ))}
        </Space>
      </Radio.Group>
    </div>
  );
};

export default AnswerRadio;
