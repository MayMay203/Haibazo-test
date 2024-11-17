import { useCallback, useEffect, useState } from "react";
import Circle from "./Component/Circle";

function App() {
  const [title, setTitle] = useState<string>("LET'S PLAY");
  const [number, setNumber] = useState<number>(0);
  const [timeUp, setTimeUp] = useState({ seconds: 0, milliseconds: 0 });
  const [status, setStatus] = useState<string>("ON");
  const [starting, setStarting] = useState(false);
  const [isPlay, setIsPlay] = useState(false);

  const handleStarting = useCallback(() => {
    setStarting(true);
  }, []);

  const handleEnd = useCallback(() => {
    setStarting(false);
    setTitle("ALL CLEARED");
    setIsPlay(false)
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
          style={{ color: title === "ALL CLEARED" ? "green" : "black" }}
        >
          {title}
        </h1>
        <div className="flex gap-x-4 items-center mb-3">
          <label>Points: </label>
          <input
            type="number"
            min={0}
            value={number === undefined ? "" : number}
            onChange={(e) => setNumber(Number(e.target.value))}
            className="w-[200px] p-1 px-2 border-[#ccc] border-[1px] rounded-[4px]"
          />
        </div>
        <div className="flex gap-x-4 mb-5">
          <label>Time:</label>
          <span>{timeUp.seconds + ":" + timeUp.milliseconds + "s"}</span>
        </div>
        <div className="flex gap-x-4">
          {title !== "LET'S PLAY" && (
            <button className="p-2 px-4 border-[green] border-[1px] rounded-[8px] text-[green]">
              Restart
            </button>
          )}
          {!isPlay && title !== 'ALL CLEARED' && (
            <button
              onClick={() => setIsPlay(true)}
              className="p-2 px-4 border-[green] border-[1px] rounded-[8px] text-[green]"
              disabled={number === 0}
              style={number === 0 ? { opacity: 0.5 } : {}}
            >
              Play
            </button>
          )}
          {isPlay && (
            <button className="p-2 px-4 border-[green] border-[1px] rounded-[8px] text-[green]">
              Restart
            </button>
          )}
          {isPlay && (
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
            Array.from({ length: number }).map((_, index) => (
              <Circle
                key={index + 1}
                value={index + 1}
                handleStarting={handleStarting}
                handleEnd={handleEnd}
                max={number}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
