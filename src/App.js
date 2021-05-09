import React, { useState, useEffect, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.scss';
import './main.css';

function App() {

  const TIMER_LABEL_SESSION = 'Session';
  const TIMER_LABEL_BREAK = 'Break';
  const SESSION_LENGTH = 25;
  const SHORT_BREAK = 5;

  const showTime = (minutes, seconds) => {
      const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
      const displaySeconds = seconds < 10 ? '0' + seconds : seconds;
      return `${displayMinutes}:${displaySeconds}`;
  };
      const audioRef = useRef(null);
      const intervaleRef = useRef(0);
      const handlerTimeRef = useRef(null);
      const [timeMinutes, setTimeMinutes] = useState(SESSION_LENGTH);
      const [timeSeconds, setTimeSeconds] = useState(0);
      const [timeLeft, setTimeLeft] = useState(showTime(SESSION_LENGTH, 0));
      const [timerLabel, setTimerlabel] = useState(TIMER_LABEL_SESSION);
      const [sessionLength, setSessionLength] = useState(SESSION_LENGTH);
      const [shortBreak, setShortBreak] = useState(SHORT_BREAK);
      const [isSessionStatus, setIsSessionStatus] = useState(true);
      const [isRunning, setIsRunning] = useState(false);

      useEffect(() => {

  		if (isRunning) {
              intervaleRef.current = setInterval(() => {
  				handlerTimeRef.current();
  			}, 1000);
  		} else {
  			clearInterval(intervaleRef.current);
  		}

          return () => {
              clearInterval(intervaleRef.current);
          };
      }, [isRunning, timeSeconds]);

      const updateMinutes = () => {
  			setTimeMinutes(timeMinutes - 1);
      };

  	const handleTime = () => {
          setTimeLeft(showTime(timeMinutes, timeSeconds));
  		if (timeMinutes === 0 && timeSeconds === 0) {
              audioRef.current.play();
              if(isSessionStatus) {
                  setTimerlabel(TIMER_LABEL_BREAK);
                  setTimeMinutes(shortBreak);
                  setTimeSeconds(1);
                  setIsSessionStatus(false);
              }else {

                  setTimerlabel(TIMER_LABEL_SESSION);
                  setTimeMinutes(sessionLength);
                  setTimeSeconds(1);
                  setIsSessionStatus(true);
              }
  		} else if ( timeSeconds === 0) {
              updateMinutes();
              setTimeSeconds(59);
          } else {
              setTimeSeconds(timeSeconds - 1);
          }
      };
      handlerTimeRef.current = handleTime;
      const reset = () => {
          setTimeLeft(showTime(SESSION_LENGTH, 0));
          setTimeMinutes(SESSION_LENGTH);
          setShortBreak(SHORT_BREAK);
          setIsRunning(false);
          setTimerlabel(TIMER_LABEL_SESSION);
          clearInterval(intervaleRef.current);
          setSessionLength(SESSION_LENGTH);
          setIsSessionStatus(true);
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
      };
  return (
  <Container className="border rounded-lg text-center mt-4"
           style={{ minWidth: 300, maxWidth: 700 }}
       >
           <h1 className="display-12 text-secondary py-4"> Pomodoro Timer </h1>
           <Row className="justify-content-center">
               <Col>
                   <div id="session-label" className="text-secondary pb-1">
                       Session Length
                   </div>
                   <InputGroup className="mx-auto" style={{width:130}} >
                       <Button
                           disabled={isRunning}
                           variant="info"
                           id="session-decrement"
                           onClick={() => {
                               if (sessionLength > 1 ) {
                                   setSessionLength(sessionLength - 1);
                                   setTimeLeft(showTime((sessionLength - 1), 0));
                                   setTimeMinutes((sessionLength - 1));
                               }
                           }}
                       >
                           -
                       </Button>
                       <FormControl
                           disabled={isRunning}
                           id="session-length"
                           value={sessionLength}
                           onChange={(e) => {
                               let currentMinutes =
                               e.target.value
                               ? parseInt(e.target.value)
                               : 1;
                               setSessionLength(currentMinutes);
                               setTimeSeconds(0);
                               setTimeLeft(showTime(currentMinutes, 0));
                               setTimeMinutes((currentMinutes));
                           }}
                           style={{maxWidth:45}}
                           className="mx-2 text-danger"
                       >
                       </FormControl>
                       <Button
                           disabled={isRunning}
                           variant="info"
                           id="session-increment"
                           onClick={() => {
                               if (sessionLength < 60) {
                                   setSessionLength(sessionLength + 1);
                                   setTimeLeft(showTime((sessionLength + 1) , 0));
                               }
                           }}
                       >
                           +
                       </Button>
                   </InputGroup>

               </Col>
               <Col>
                   <div
                       id="break-label"
                       className="text-secondary pb-1"
                   >Break Length</div>
                   <InputGroup className="mx-auto" style={{width:130}}>
                       <Button
                           disabled={isRunning}
                           variant="info"
                           id="break-decrement"
                           onClick={() => {
                               setShortBreak(shortBreak > 1 ? shortBreak - 1 : 1);
                           }}
                       >-</Button>
                       <FormControl
                           disabled={isRunning}
                           id="break-length"
                           value={shortBreak}
                           onChange={(e) => {
                               let currentMinutesBreak =
                               e.target.value
                               ? parseInt(e.target.value)
                               : 1;
                               setShortBreak(currentMinutesBreak);
                           }}
                           style={{maxWidth:45}}
                           className="mx-2 text-danger"
                       />
                       <Button
                           disabled={isRunning}
                           variant="info"
                           id="break-increment"
                           onClick={() => {
                               setShortBreak(
                                   shortBreak < 60 ? shortBreak + 1 : 60
                               );
                           }}
                       >+</Button>
                   </InputGroup>
               </Col>
           </Row>
           <Row>
               <Col className="pt-2">
                   <div
                       className="border
                           rounded-pill
                           my-4
                           w-50
                           mx-auto
                           py-2
                           shadow-sm"
                       >
                       <div id="timer-label" className="pt-3">
                           <h4 className="text-secondary">{timerLabel}</h4>
                       </div>
                       <div id="time-left" className="timer-font text-info">
                           {timeLeft}
                       </div>
                   </div>
                   <div className="pb-5 pt-3">
                       <Button
                           variant="info"
                           className="mx-4"
                           id="start_stop"
                           onClick={() => {
                               setIsRunning(!isRunning);
                           }}
                       >
                           {!isRunning ? 'Start' : 'Stop'}
                       </Button>
                       <Button
                           variant="info"
                           className="mx-4"
                           id="reset"
                           onClick={() => {
                               reset();
                           }}
                       >
                           Reset
                       </Button>
                   </div>
               </Col>
           </Row>
           <audio
               id="beep"
               src="https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"
               ref={audioRef}
               preload="auto"
           />
       </Container>
   );
};

export default App;
