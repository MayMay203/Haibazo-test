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
        <div className="flex gap-x-4 mb-5">
          <label>Time:</label>
          <span>{timeUp.seconds + ":" + timeUp.milliseconds + "s"}</span>
        </div>
        <div className="flex gap-x-4">
          {!isPlay && title !== "ALL CLEARED" && (
            <button
              onClick={() => {
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
            <button className="p-2 px-4 border-[green] border-[1px] rounded-[8px] text-[green]">
              Restart
            </button>
          )}
          {isPlay && title === "LET'S PLAY" && (
            <button className="p-2 px-4 border-[green] border-[1px] rounded-[8px] text-[green]">
              Auto play <span>{status}</span>
            </button>
          )}
        </div>
        <div
          className="mt-5 w-[900px] h-[500px] bg-[#fafaed] relative"
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
                setStopAll={()=>setStopAll(true)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
