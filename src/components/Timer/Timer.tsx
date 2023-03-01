import { useState } from "react";
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

export const Timer = (): JSX.Element => {
  const [timerState, setTimerState] = useState<TimerState>(TimerState.STOPPED);

  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);
  const [second, setSecond] = useState<number>(0);

  const toggleTimer = () => {
    if (timerState === TimerState.STARTED) setTimerState(TimerState.PAUSED);
    else setTimerState(TimerState.STARTED);
  }

  const resetTimer = () => {
    setTimerState(TimerState.STOPPED);
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

  return (
    <div className="timer">

      <div className="timerInputs">
        <TimerInputField num={hour} setNum={setHour} max={TIMER_MAX_HOUR} min={TIMER_MIN_HOUR} />
        <p className="fieldSeparator">:</p>
        <TimerInputField num={minute} setNum={setMinute} max={TIMER_MAX_MINUTE} min={TIMER_MIN_MINUTE} />
        <p className="fieldSeparator">:</p>
        <TimerInputField num={second} setNum={setSecond} max={TIMER_MAX_SECOND} min={TIMER_MIN_SECOND} />
      </div>

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

  const incrementNum = () => setNum(Math.min(max, num + 1));
  const decrementNum = () => setNum(Math.max(min, num - 1));

  return (
    <div className="timerInput">
      <button disabled={num == max} onClick={incrementNum}>+</button>
      <input value={getDisplayNumber(num)} />
      <button disabled={num == min} onClick={decrementNum}>-</button>
    </div>
  )
}

export default Timer;