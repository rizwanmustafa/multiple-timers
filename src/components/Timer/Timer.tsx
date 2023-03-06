import { useEffect, useRef, useState } from "react";
import ActualTimer, { getTotalSeconds } from "../../ActualTimer";
import "./styles.css";

const TIMER_MAX_HOUR = 99;
const TIMER_MIN_HOUR = 0;
const TIMER_MAX_MINUTE = 59;
const TIMER_MIN_MINUTE = 0;
const TIMER_MAX_SECOND = 59;
const TIMER_MIN_SECOND = 0;

enum TimerState {
  STOPPED,
  STARTED,
  PAUSED
}

interface TimerInputsProps {
  hour: number;
  setHour: React.Dispatch<React.SetStateAction<number>>;
  minute: number;
  setMinute: React.Dispatch<React.SetStateAction<number>>;
  second: number;
  setSecond: React.Dispatch<React.SetStateAction<number>>;
}

const TimerInputs = (props: TimerInputsProps): JSX.Element => {
  return (
    <div className="timerInputs">
      <TimerInputField num={props.hour} setNum={props.setHour} max={TIMER_MAX_HOUR} min={TIMER_MIN_HOUR} />
      <p className="fieldSeparator">:</p>
      <TimerInputField num={props.minute} setNum={props.setMinute} max={TIMER_MAX_MINUTE} min={TIMER_MIN_MINUTE} />
      <p className="fieldSeparator">:</p>
      <TimerInputField num={props.second} setNum={props.setSecond} max={TIMER_MAX_SECOND} min={TIMER_MIN_SECOND} />
    </div>
  );
}

export const Timer = (): JSX.Element => {
  const [timerState, setTimerState] = useState<TimerState>(TimerState.STOPPED);
  const [timerStatus, setTimerStatus] = useState<{ elapsedSeconds: number, remainingSeconds: number }>({ elapsedSeconds: 0, remainingSeconds: 0 });
  const timer = useRef<null | ActualTimer>(null);

  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);
  const [second, setSecond] = useState<number>(0);


  const toggleTimer = () => {
    if (timerState === TimerState.STARTED) {
      setTimerState(TimerState.PAUSED);

      timer.current?.pause();
    }

    else {
      setTimerState(TimerState.STARTED);
      const timerSeconds = getTotalSeconds(hour, minute, second);
      if (timer.current === null) timer.current = new ActualTimer(timerSeconds);
      console.log(timer);
      timer.current.start();
    }
  }

  const resetTimer = () => {
    setTimerState(TimerState.STOPPED);
    timer.current = null;
  }

  const getButtonText = (): string => {
    if (timerState === TimerState.STARTED) {
      return "Pause";
    }
    else if (timerState === TimerState.PAUSED) {
      return "Resume";
    }
    else {
      return "Start";
    }
  }


  // Manage timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (timer.current === null) return;

      const newElapsedSeconds = timer.current?.getElapsedSeconds() ?? 0;
      const newRemainingSeconds = timer.current?.getRemainingSeconds() ?? 0;

      if (timerStatus.elapsedSeconds !== newElapsedSeconds || timerStatus.remainingSeconds !== newRemainingSeconds) {
        setTimerStatus({ elapsedSeconds: newElapsedSeconds, remainingSeconds: newRemainingSeconds });
      }

      if (newRemainingSeconds === 0) {
        console.log("The timer has finished!")
        resetTimer();
      }

    }, 10);

    return () => clearInterval(interval);
  }, [])



  return (
    <div className="timer">

      {
        timerState === TimerState.STOPPED &&
        <TimerInputs
          hour={hour} setHour={setHour}
          minute={minute} setMinute={setMinute}
          second={second} setSecond={setSecond}
        />
      }

      {timerState !== TimerState.STOPPED && <p>{`Elapsed Seconds: ${timerStatus.elapsedSeconds} Remaining Seconds: ${timerStatus.remainingSeconds}`}</p>}

      <div className="controlPanel">
        <button
          disabled={(hour + minute + second) === 0}
          onClick={toggleTimer}
        >
          {getButtonText()}
        </button>

        <button
          disabled={timerState === TimerState.STOPPED}
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

interface TimerInputFieldProps {
  num: number;
  min: number;
  max: number;
  setNum: React.Dispatch<React.SetStateAction<number>>;
}

const TimerInputField = (props: TimerInputFieldProps): JSX.Element => {
  const { num, setNum, min, max } = props;

  const getDisplayNumber = (num: number) => num.toString().padStart(2, "0");

  const incrementNum = () => {
    const newNum = num + 1;
    setNum(newNum <= max ? newNum : min);
  }

  const decrementNum = () => {
    const newNum = num - 1;
    setNum(newNum >= min ? newNum : max);
  }

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (/^-?\d+$/.test(e.currentTarget.value)) {
      const number = Number(e.currentTarget.value);
      if (number <= max && number >= min) {
        setNum(number);
      }
    }
  }

  return (
    <div className="timerInput">
      <button onClick={incrementNum}>+</button>
      <input value={getDisplayNumber(num)} onChange={handleInputChange} />
      <button onClick={decrementNum}>-</button>
    </div>
  )
}

export default Timer;