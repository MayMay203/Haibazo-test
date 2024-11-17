import { useCallback, useEffect, useState } from "react";
import Circle from "./Component/Circle";

function App() {
  const [title, setTitle] = useState<string>("LET'S PLAY");
  const [number, setNumber] = useState<string>("");
  const [timeUp, setTimeUp] = useState({ seconds: 0, milliseconds: 0 });
  const [status, setStatus] = useState<string>("ON");
  const [starting, setStarting] = useState(false);
  const [isPlay, setIsPlay] = useState(false);
  const [currentNumber, setCurrentNumber] = useState<number>(0);
  const [stopAll, setStopAll] = useState(false);
  const [restart, setRestart] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  const handleStarting = useCallback(() => {
    setStarting(true);
  }, []);

  const handleNumberChange = useCallback((value: number) => {
    setCurrentNumber(value);
  }, []);

  const handleEnd = useCallback((title: string) => {
    setStarting(false);
    setTitle(title);
  }, []);

  useEffect(() => {
    if (!starting) return;

    const timerId = setInterval(() => {
      setTimeUp((prevTime) => {
        const newMiliSeconds = prevTime.milliseconds + 1;
        const newSeconds =
          newMiliSeconds === 10 ? prevTime.seconds + 1 : prevTime.seconds;
        return {
          seconds: newSeconds,
          milliseconds: newMiliSeconds === 10 ? 0 : newMiliSeconds,
        };
      });
    }, 100);

    return () => {
      clearInterval(timerId);
    };
  }, [starting]);

  const handleAutoPlay = () => {
    setAutoPlay((prev) => !prev);
    setStatus(autoPlay ? "ON" : "OFF");
  };
  return (
    <div className="flex justify-center">
      <div className="p-7">
        <h1
          className="text-[20px] font-bold mb-3"
          style={{
            color:
              title === "ALL CLEARED"
                ? "green"
                : title === "GAME OVER"
                ? "red"
                : "black",
          }}
        >
          {title}
        </h1>
        <div className="flex gap-x-4 items-center mb-3">
          <label>Points: </label>
          <input
            value={number}
            onChange={(e) => {
              setIsPlay(false);
              setTimeUp({ seconds: 0, milliseconds: 0 });
              handleEnd("LET'S PLAY");
              setNumber(e.target.value);
            }}
            type="number"
            className="w-[200px] text-[18px] outline-none border border-gray-300 rounded-[8px] p-2 no-spinner"
            onKeyDown={(e) => {
              if (
                !/[0-9]/.test(e.key) &&
                e.key !== "Backspace" &&
                e.key !== "Tab"
              ) {
                e.preventDefault();
              }
            }}
          />
        </div>
        <div className="flex gap-x-6 mb-5">
          <label>Time:</label>
          <span className="font-bold">
            {timeUp.seconds + "." + timeUp.milliseconds + "s"}
          </span>
        </div>
        <div className="flex gap-x-4">
          {!isPlay && title !== "ALL CLEARED" && (
            <button
              onClick={() => {
                setAutoPlay(false);
                setStatus("ON");
                setCurrentNumber(0);
                setIsPlay(true);
                handleStarting();
              }}
              className="p-2 px-4 border-[green] border-[1px] rounded-[8px] text-[green]"
              disabled={number === "0" || number === ""}
              style={number === "" || number === "0" ? { opacity: 0.5 } : {}}
            >
              Play
            </button>
          )}
          {isPlay && (
            <button
              className="p-2 px-4 border-[green] border-[1px] rounded-[8px] text-[green]"
              onClick={() => {
                setTimeUp({ seconds: 0, milliseconds: 0 });
                setRestart((prev) => !prev);
                setAutoPlay(false);
                setStatus("ON");
                setStopAll(false);
                handleEnd("LET'S PLAY");
                handleStarting();
                setCurrentNumber(0);
              }}
            >
              Restart
            </button>
          )}
          {isPlay && title === "LET'S PLAY" && (
            <button
              className="p-2 px-4 border-[green] border-[1px] rounded-[8px] text-[green]"
              onClick={handleAutoPlay}
            >
              Auto play <span>{status}</span>
            </button>
          )}
        </div>
        <div
          className="mt-5 w-[900px] h-[500px] relative"
          style={{ border: "1px solid #ccc" }}
        >
          {isPlay &&
            Array.from({ length: Number(number) }).map((_, index) => (
              <Circle
                currentNumber={currentNumber}
                handleNumberChange={handleNumberChange}
                key={index + 1}
                value={index + 1}
                handleEnd={handleEnd}
                max={Number(number)}
                stopAll={stopAll}
                setStopAll={() => setStopAll(true)}
                restart={restart}
                autoPlay={autoPlay}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
