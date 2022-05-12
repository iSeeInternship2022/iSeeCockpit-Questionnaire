import React, { useEffect, useCallback, useMemo, useState } from 'react';

import { Button, Card, Layout, Input, Space } from 'antd';

import { EllipsisOutlined } from '@ant-design/icons';

import './DialogQuestionnaires.less';

import AnswerCheckbox from '@/components/iSee/chatbot/AnswerCheckbox';
import AnswerRadio from '@/components/iSee/chatbot/AnswerRadio';
import type { Question } from '@/models/questionnaire';

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
      validators: {
        min: 1,
        max: 10,
      },
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
  const [type, setType] = useState<string>();
  const [text, setText] = useState('');
  const [stateRadio, setStateRadio] = useState('');
  const [stateCheckBox, setStateCheckBox] = useState<string[]>([]);
  const [dialogComp, setDialogComp] = useState<JSX.Element[]>([]);
  const [answer, setAnwser] = useState([<React.Fragment key={'no answer'} />]);
  const [question, setQuestion] = useState<Question>();
  const [error, setError] = useState<string>('');
  const [index, setIndex] = useState<number>(0);
  const [disable, setDisable] = useState(false);

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
              key={'answer' + index}
              listAnswer={currentQuestion.metric_values}
            />,
          ]);
          break;
        case 'Checkbox':
          setAnwser([
            <AnswerCheckbox
              onChange={(checkedValue) => setStateCheckBox(checkedValue)}
              key={'answer' + index}
              listAnswer={currentQuestion.metric_values}
            />,
          ]);
          break;
        case 'Likert':
          setAnwser([
            <AnswerRadio
              key={'answer' + index}
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
    [index],
  );

  function updateJson(myAnswer: string | object) {
    json.questions[index - 1].answer = myAnswer;
  }

  function addAnswer() {
    switch (type) {
      case 'Radio':
        setDialogComp((oldDialogComp) => [
          ...oldDialogComp,
          <div className="answer" key={'answer' + oldDialogComp.length}>
            <p>{stateRadio}</p>
          </div>,
        ]);
        updateJson(stateRadio);
        break;
      case 'Checkbox':
        setDialogComp((oldDialogComp) => [
          ...oldDialogComp,
          <div className="answer" key={'answer' + oldDialogComp.length}>
            <p>{stateCheckBox.join(', ')}</p>
          </div>,
        ]);

        updateJson(stateCheckBox);
        break;
      case 'Likert':
        setDialogComp((oldDialogComp) => [
          ...oldDialogComp,
          <div className="answer" key={'answer' + oldDialogComp.length}>
            <p>{stateRadio}</p>
          </div>,
        ]);
        updateJson(stateRadio);
        break;
      default:
        setDialogComp((oldDialogComp) => [
          ...oldDialogComp,
          <div className="answer" key={'answer' + oldDialogComp.length}>
            <p>{text}</p>
          </div>,
        ]);
        updateJson(text);
        break;
    }
  }

  function promiseQuestion() {
    setDisable(true);
    setDialogComp((oldDialogComp) => [
      ...oldDialogComp,
      <EllipsisOutlined id="attenteQuestion" key="test" />,
    ]);
    return new Promise<void>((resolve) => {
      setTimeout(function () {
        setDialogComp((old) => {
          const oldArray = old.slice();
          oldArray.pop();
          return oldArray;
        });
        resolve();
      }, 2000);
    });
  }

  function sendAnswer() {
    if (dialogComp.length % 2) addAnswer();

    promiseQuestion().then(() => {
      if (questions.length !== index) {
        setQuestion(questions[index]);
        setIndex(index + 1);
      }
      if (questions.length == index && !(dialogComp.length % 2)) {
        setType('Radio');
      }

      setText('');
      setStateRadio('');
      setError('');
      setDisable(false);
    });
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

  function skip() {
    if (!question?.required) {
      if (dialogComp.length % 2) {
        setDialogComp((oldDialogComp) => [
          ...oldDialogComp,
          <div className="answer" key={'answer' + oldDialogComp.length}>
            <p>SKIP</p>
          </div>,
        ]);
      }
      promiseQuestion().then(() => {
        if (questions.length !== index) {
          setQuestion(questions[index]);
          setIndex(index + 1);
        }
        if (questions.length == index && !(dialogComp.length % 2)) {
          setDisable(true);
          setType('Radio');
        }

        setText('');
        setStateRadio('');
        setError('');
        setDisable(false);
      });
    }
  }

  function generateJSON() {
    if (!sessionStorage.getItem('chatbot')) {
      sessionStorage.setItem('chatbot', JSON.stringify(json));
    } else {
      if (sessionStorage.getItem('chatbot') !== JSON.stringify(json)) {
        sessionStorage.removeItem('chatbot');
        sessionStorage.setItem('chatbot', JSON.stringify(json));
      }
    }
  }

  useEffect(() => {
    setQuestion(questions[index]);
    setIndex(index + 1);
    console.log('render');
  }, [questions]);

  useEffect(() => {
    console.log('render 2');
    if (!question) return;
    addQuestion(question);
    addTypeAnswerFooter(question);
  }, [question]);

  return (
    <>
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
                  type={type === 'Number' ? 'number' : 'text'}
                  placeholder={
                    error == ''
                      ? type === 'Number'
                        ? 'Answer :   min :' +
                          question?.validators?.min +
                          ' max : ' +
                          question?.validators?.max
                        : 'Answer'
                      : error
                  }
                  value={
                    type === 'Number' && question?.validators
                      ? parseInt(text) >= question?.validators?.min &&
                        parseInt(text) <= question?.validators?.max
                        ? text
                        : parseInt('')
                      : text
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
                  disabled={type === 'Likert' || type === 'Radio' || type === 'Checkbox'}
                  id="input"
                />
                <Button
                  type="primary"
                  onClick={send}
                  disabled={(questions.length == index && !(dialogComp.length % 2)) || disable}
                >
                  Send
                </Button>
                <Button
                  onClick={skip}
                  type="default"
                  disabled={
                    question?.required ||
                    (questions.length == index && !(dialogComp.length % 2)) ||
                    disable
                  }
                >
                  Skip
                </Button>
              </Space>
            </Space>
          </Footer>
        </Layout>
      </Card>
      <Button
        id="generateJson"
        type="primary"
        onClick={generateJSON}
        disabled={questions.length !== index || dialogComp.length % 2 !== 0}
      >
        {' '}
        Generate JSON{' '}
      </Button>
    </>
  );
};

export default DialogQuestionnaires;
