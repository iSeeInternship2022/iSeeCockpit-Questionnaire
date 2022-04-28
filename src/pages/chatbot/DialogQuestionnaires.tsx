import React, { useEffect, useCallback, useMemo, useState } from 'react';

import { Button, Card, Layout, Input, Space } from 'antd';

import './DialogQuestionnaires.less';

import AnswerLikert from '@/components/iSee/chatbot/AnswerLikert';
import AnswerCheckbox from '@/components/iSee/chatbot/AnswerCheckbox';
import AnswerRadio from '@/components/iSee/chatbot/AnswerRadio';

const json = {
  questions: [
    {
      text: 'This is a free text question',
      category: 'Goodness',
      required: false,
      metric: 'Free-Text',
      id: 'q-789801',
    },
    {
      text: 'This is a checkbox question (e.g. modes of transport used)',
      category: 'Mental Model',
      required: false,
      metric: 'Checkbox',
      metric_values: [
        {
          val: 'Car',
        },
        {
          val: 'Bus',
        },
        {
          val: 'Train',
        },
        {
          val: 'Bike',
        },
      ],
      id: 'q-979001',
    },
    {
      text: 'This is a numeric question',
      category: 'Curiosity',
      required: false,
      metric: 'Number',
      id: 'q-559181',
    },
    {
      text: 'This is a likert',
      category: 'Trust',
      required: false,
      metric: 'Likert',
      metric_values: [
        {
          val: 'We will check it later',
        },
        {
          val: 'later',
        },
      ],
      id: 'q-15941',
    },
    {
      text: 'This is a radio question',
      category: 'Performance',
      required: false,
      metric: 'Radio',
      metric_values: [
        {
          val: 'Yes',
        },
        {
          val: 'No',
        },
        {
          val: 'Maybe',
        },
      ],
      id: 'q-5661',
    },
  ],
};

const DialogQuestionnaires: React.FC = () => {
  const questions = useMemo(() => json.questions, []);

  const [type, setType] = useState('');
  const [text, setText] = useState('');
  const [stateRadio, setStateRadio] = useState('');
  const [stateCheckBox, setStateCheckBox] = useState([]);
  const [dialogComp, setDialogComp] = useState([<React.Fragment key={'no answer'} />]);
  const [answer, setAnwser] = useState([<React.Fragment key={'no answer'} />]);
  const [disable, setDisable] = useState(false);
  const [oneMoreTime, setOneMoreTime] = useState(true);

  const addQuestionAnswer = useCallback(
    function () {
      const question = questions.shift();
      setType(question?.metric || 'Free-Text');

      setDialogComp((oldQuestionComp) => [
        ...oldQuestionComp,
        <div className="question" key={'question' + questions.length}>
          {' '}
          <h1>{question?.text}</h1>
        </div>,
      ]);

      switch (question?.metric) {
        case 'Radio':
          setAnwser([
            <AnswerRadio
              /* onClick={send} */ onChange={(e) => setStateRadio(e.target.value)}
              key={'answer' + questions.length}
              listAnswer={question.metric_values}
            />,
          ]);
          break;
        case 'Checkbox':
          setAnwser([
            <AnswerCheckbox
              onChange={(checkedValue) => setStateCheckBox(checkedValue)}
              key={'answer' + questions.length}
              listAnswer={question.metric_values}
            />,
          ]);
          break;
        case 'Likert':
          setAnwser([
            <AnswerLikert
              /* onClick={send }*/ key={'answer' + questions.length}
              onChange={(e) => setStateRadio(e.target.value)}
              listAnswer={question.metric_values}
            />,
          ]);
          break;
        default:
          setAnwser([<React.Fragment key={'no data'} />]);
          break;
      }
    },
    [questions],
  );

  function addAnswer() {
    switch (type) {
      case 'Radio':
        setDialogComp((oldDialogComp) => [
          ...oldDialogComp,
          <div className="answer" key={'dialog' + questions.length}>
            <p>{stateRadio}</p>
          </div>,
        ]);
        break;
      case 'Checkbox':
        setDialogComp((oldDialogComp) => [
          ...oldDialogComp,
          <div className="answer" key={'dialog' + questions.length}>
            {' '}
            <p>{stateCheckBox.join(', ')}</p>
          </div>,
        ]);
        break;
      case 'Likert':
        setDialogComp((oldDialogComp) => [
          ...oldDialogComp,
          <div className="answer" key={'dialog' + questions.length}>
            {' '}
            <p>{stateRadio}</p>
          </div>,
        ]);
        break;
      default:
        setDialogComp((oldDialogComp) => [
          ...oldDialogComp,
          <div className="answer" key={'dialog' + questions.length}>
            {' '}
            <p>{text}</p>{' '}
          </div>,
        ]);
        break;
    }
  }

  function sendAnswer() {
    if (questions.length == 0) {
      if (oneMoreTime == false) {
        setDisable(true);
      } else {
        setOneMoreTime(false);
        addAnswer();
      }
    } else {
      addAnswer();
      addQuestionAnswer();
    }
    setText('');
  }

  function inputNotNUll() {
    return text != '' || (type != 'Free-Text' && type != 'Number');
  }

  function checkboxNotNull() {
    return stateCheckBox.length != 0 || type != 'Checkbox';
  }

  function radioNotNull() {
    return stateRadio != '' || (type != 'Likert' && type != 'Radio');
  }

  function send() {
    console.log(stateCheckBox);
    if (inputNotNUll() && checkboxNotNull() && radioNotNull()) {
      sendAnswer();
    }
  }

  useEffect(() => {
    addQuestionAnswer();
  }, [addQuestionAnswer]);

  return (
    <Card
      title="iSee ChatBot"
      extra={<a onClick={() => window.location.reload()}>Restart</a>}
      style={{ width: '80%', height: 'content-card', margin: 'auto' }}
    >
      <Layout id="layout">
        <Layout.Content id="content-card">{dialogComp}</Layout.Content>
        <Layout.Footer id="footer">
          <Space direction="vertical">
            {answer}
            <Space id="fixed" direction="horizontal">
              <Input
                placeholder="Answer"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={type === 'Likert' || type === 'Radio' || type === 'Checkbox'}
              />
              <Button type="primary" onClick={send} disabled={disable}>
                Send
              </Button>
            </Space>
          </Space>
        </Layout.Footer>
      </Layout>
    </Card>
  );
};

export default DialogQuestionnaires;
