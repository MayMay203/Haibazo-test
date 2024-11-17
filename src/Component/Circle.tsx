import { memo, useEffect, useRef, useState } from "react";

function Circle({
  value,
  max,
  handleEnd,
  currentNumber,
  handleNumberChange,
  stopAll,
  setStopAll,
  restart,
}: {
  value: number;
  handleEnd: Function;
  max: number;
  currentNumber: number;
  handleNumberChange: Function;
  stopAll: boolean;
  setStopAll: Function;
  restart: boolean;
}) {
  const circleRef = useRef<HTMLDivElement | null>(null);
  const [starting, setStarting] = useState(false);
  const [time, setTime] = useState({ seconds: 1, miliSeconds: 0 });
  const [opacity, setOpacity] = useState(1);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.backgroundColor = "white";
    }
    setOpacity(1);
    setStarting(false);
    setTime({ seconds: 1, miliSeconds: 0 });
  }, [restart]);

  useEffect(() => {
    if (isFinished) {
      if (value === max) {
        handleEnd("ALL CLEARED");
      }
      setStarting(false);
    }
  }, [isFinished]);

  const getRandomPosition = () => Math.floor(Math.random() * 90);

  const handleClick = () => {
    if (circleRef.current) {
      circleRef.current.style.backgroundColor = "red";
    }
    if (!starting) {
      if (currentNumber + 1 !== value) {
        handleEnd("GAME OVER");
        setStopAll(true);
        setStarting(false);
        return;
      }
      handleNumberChange(value);
      setStarting(true);
    }
  };

  useEffect(() => {
    setPosition({
      top: getRandomPosition(),
      left: getRandomPosition(),
    });
  }, []);

  useEffect(() => {
    if (!starting || stopAll) return;
    const timerId = setInterval(() => {
      setOpacity((prev) => prev - 1.0 / 10);
      setTime((prevTime) => {
        if (prevTime.miliSeconds === 1 && prevTime.seconds === 0) {
          clearInterval(timerId);
          setIsFinished(true);
        }
        let newMiliSeconds = prevTime.miliSeconds - 1;
        const newSeconds =
          newMiliSeconds === -1 ? prevTime.seconds - 1 : prevTime.seconds;
        return {
          seconds: newSeconds,
          miliSeconds: newMiliSeconds === -1 ? 9 : newMiliSeconds,
        };
      });
    }, 100);

    return () => clearInterval(timerId);
  }, [starting, stopAll]);

  return (
    <div
      className="absolute rounded-full w-[50px] h-[50px] flex flex-col items-center justify-center"
      onClick={handleClick}
      ref={circleRef}
      style={{
        top: `${position.top}%`,
        left: `${position.left}%`,
        border: "1px solid red",
        opacity: opacity,
        pointerEvents: opacity < 0.05 ? "none" : "auto",
      }}
    >
      {value}
      {starting && (
        <span className="text-[#fff] mt-1">
          {time.seconds}:{time.miliSeconds}
        </span>
      )}
    </div>
  );
}

export default memo(Circle);
