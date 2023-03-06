import { useEffect, useRef, useState } from "react";
import ReactHowler from "react-howler";
import ActualTimer, { getHours, getMinutes, getSeconds, getTotalSeconds } from "../../ActualTimer";
import Music from "../../music/1.mp3";
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
function beep() {
  var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
  snd.play();
}


const getButtonText = (timerState: TimerState): string => {
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

export const Timer = (): JSX.Element => {
  const [timerState, setTimerState] = useState<TimerState>(TimerState.STOPPED);
  const [timerStatus, setTimerStatus] = useState<{ elapsedSeconds: number, remainingSeconds: number }>({ elapsedSeconds: 0, remainingSeconds: 0 });
  const timer = useRef<null | ActualTimer>(null);

  const [playing, setPlaying] = useState<boolean>(false);
  const player = useRef<null | ReactHowler>(null);

  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);
  const [second, setSecond] = useState<number>(0);


  const toggleTimer = () => {
    if (timerState === TimerState.STARTED) {
      setTimerState(TimerState.PAUSED);

      timer.current?.pause();
    }

    else {
      const timerSeconds = getTotalSeconds(hour, minute, second);
      if (timerState === TimerState.STOPPED) timer.current = new ActualTimer(timerSeconds);
      timer.current?.start();
      setTimerState(TimerState.STARTED);
    }
  }

  const resetTimer = () => {
    setTimerState(TimerState.STOPPED);
    timer.current = null;
  }




  // Manage timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (timer.current === null) return;

      const newElapsedSeconds = timer.current?.getElapsedSeconds() ?? 0;
      const newRemainingSeconds = timer.current?.getRemainingSeconds() ?? 0;

      if (timerStatus.elapsedSeconds !== newElapsedSeconds || timerStatus.remainingSeconds !== newRemainingSeconds) {
        setTimerStatus({ elapsedSeconds: newElapsedSeconds, remainingSeconds: newRemainingSeconds });
        beep();
      } 

      if (newRemainingSeconds === 0) {
        console.log("The timer has finished!")
        resetTimer();
        setPlaying(true);
        if(player.current) player.current.seek(0);

      }

    }, 10);

    return () => clearInterval(interval);
  })



  return (
    <div className="timer">

      {<ReactHowler src={Music} playing={playing} loop={true} preload={true} ref={(ref) => player.current = ref}/>}

      {
        timerState === TimerState.STOPPED &&
        <TimerInputs
          hour={hour} setHour={setHour}
          minute={minute} setMinute={setMinute}
          second={second} setSecond={setSecond}
        />
      }

      {timerState !== TimerState.STOPPED && <p>{`Elapsed Seconds: ${timerStatus.elapsedSeconds} Remaining Seconds: ${timerStatus.remainingSeconds}`}</p>}
      {timerState !== TimerState.STOPPED && <TimerCountdown timer={timer.current} />}

      <div className="controlPanel">
        <button
          disabled={(hour + minute + second) === 0}
          onClick={toggleTimer}
        >
          {getButtonText(timerState)}
        </button>

        <button
          disabled={timerState === TimerState.STOPPED}
          onClick={resetTimer}
        >
          Reset
        </button>

        {playing && <button onClick={() => setPlaying(false)}>Stop Playing</button>}
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

interface TimerCountdownProps {
  timer: ActualTimer | null;
}

const TimerCountdown = (props: TimerCountdownProps): JSX.Element => {
  const { timer } = props;
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer === null) return;

      const newRemainingSeconds = timer.getRemainingSeconds();
      if (remainingSeconds !== newRemainingSeconds) {
        setRemainingSeconds(newRemainingSeconds);
      }

    }, 10);

    return () => clearInterval(interval);
  })


  const hours = getHours(remainingSeconds);
  const minutes = getMinutes(remainingSeconds);
  const seconds = getSeconds(remainingSeconds);


  return (
    <div className="timerCountdown">
      <p>{hours}</p>
      <p>:</p>
      <p>{minutes}</p>
      <p>:</p>
      <p>{seconds}</p>
    </div>

  )
}

export default Timer;