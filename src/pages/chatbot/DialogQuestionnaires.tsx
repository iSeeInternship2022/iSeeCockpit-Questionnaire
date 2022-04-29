import React, { useEffect, useCallback, useMemo, useState } from 'react';

import { Button, Card, Layout, Input, Space } from 'antd';

import './DialogQuestionnaires.less';

//import AnswerLikert from '@/components/iSee/chatbot/AnswerLikert';
import AnswerCheckbox from '@/components/iSee/chatbot/AnswerCheckbox';
import AnswerRadio from '@/components/iSee/chatbot/AnswerRadio';

interface Question {
  id?: string;
  text?: string;
  metric?: string;
  category?: string;
  metric_values?: {
    val: string;
  }[];
  required?: boolean;
  completed?: boolean;
}

const json = {
  questions: [
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
    {
      text: 'This is a free text question',
      category: 'Goodness',
      required: false,
      metric: 'Free-Text',
      id: 'q-789801',
    },
  ],
};

const DialogQuestionnaires: React.FC = () => {
  const { Footer, Content } = Layout;
  const questions = useMemo(() => json.questions, []);
  const [type, setType] = useState('');
  const [text, setText] = useState('');
  const [stateRadio, setStateRadio] = useState('');
  const [stateCheckBox, setStateCheckBox] = useState<string[]>([]);
  const [dialogComp, setDialogComp] = useState<JSX.Element[]>([]);
  const [answer, setAnwser] = useState([<React.Fragment key={'no answer'} />]);
  const [disable, setDisable] = useState(false);
  const [question, setQuestion] = useState<Question>();
  const [error, setError] = useState<string>('');

  const addQuestion = useCallback(function (currentQuestion) {
    setDialogComp((oldQuestionComp) => [
      ...oldQuestionComp,
      <div className="question" key={'question' + oldQuestionComp}>
        <p>{currentQuestion?.text}</p>
      </div>,
    ]);
  }, []);

  const addTypeAnswerFooter = useCallback(
    function (currentQuestion) {
      setType(currentQuestion?.metric || 'Free-Text');
      switch (currentQuestion?.metric) {
        case 'Radio':
          setAnwser([
            <AnswerRadio
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStateRadio(e.target.value)}
              key={'answer' + questions.length}
              listAnswer={currentQuestion.metric_values}
            />,
          ]);
          break;
        case 'Checkbox':
          setAnwser([
            <AnswerCheckbox
              onChange={(checkedValue) => setStateCheckBox(checkedValue)}
              key={'answer' + questions.length}
              listAnswer={currentQuestion.metric_values}
            />,
          ]);
          break;
        case 'Likert':
          setAnwser([
            <AnswerRadio
              key={'answer' + questions.length}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStateRadio(e.target.value)}
              listAnswer={currentQuestion.metric_values}
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
          <div className="answer" key={'answer' + oldDialogComp.length}>
            <p>{stateRadio}</p>
          </div>,
        ]);
        break;
      case 'Checkbox':
        setDialogComp((oldDialogComp) => [
          ...oldDialogComp,
          <div className="answer" key={'answer' + oldDialogComp.length}>
            <p>{stateCheckBox.join(', ')}</p>
          </div>,
        ]);
        break;
      case 'Likert':
        setDialogComp((oldDialogComp) => [
          ...oldDialogComp,
          <div className="answer" key={'answer' + oldDialogComp.length}>
            <p>{stateRadio}</p>
          </div>,
        ]);
        break;
      default:
        setDialogComp((oldDialogComp) => [
          ...oldDialogComp,
          <div className="answer" key={'answer' + oldDialogComp.length}>
            <p>{text}</p>
          </div>,
        ]);
        break;
    }
  }

  function sendAnswer() {
    if (dialogComp.length % 2) addAnswer();
    if (questions.length !== 0) {
      setQuestion(questions.shift());
    }
    if (questions.length == 0 && !(dialogComp.length % 2)) {
      setDisable(true);
      setType('Radio');
    }

    setText('');
    setStateRadio('');
    setError('');
  }

  function send() {
    if (inputNotNUll() && checkboxNotNull() && radioNotNull()) {
      sendAnswer();
    }
    if (!inputNotNUll()) {
      sendError();
    }
  }

  function sendError() {
    setError('Please, answer the question');
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

  useEffect(() => {
    setQuestion(questions.shift());
    console.log('render');
  }, [questions]);

  useEffect(() => {
    console.log('render 2');
    if (!question) return;
    addQuestion(question);
    addTypeAnswerFooter(question);
  }, [addQuestion, addTypeAnswerFooter, question]);

  return (
    <Card
      title="iSee ChatBot"
      extra={<a onClick={() => window.location.reload()}>Restart</a>}
      id="card"
    >
      <Layout id="layout">
        <Content id="content-card">{[...dialogComp.slice().reverse()]}</Content>
        <Footer id="footer">
          <Space align="center" direction="vertical">
            {answer}
            <Space /* id="fixed" */ direction="horizontal">
              <Input
                placeholder={error == '' ? 'Answer' : error}
                value={text}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
                disabled={type === 'Likert' || type === 'Radio' || type === 'Checkbox'}
                id="input"
              />
              <Button type="primary" onClick={send} disabled={disable}>
                Send
              </Button>
            </Space>
          </Space>
        </Footer>
      </Layout>
    </Card>
  );
};

export default DialogQuestionnaires;
