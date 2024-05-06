import React, { useState, useEffect } from 'react';
import Sound from 'react-sound';

function App() {
  const [cycles, setCycles] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [timers, setTimers] = useState([]);
  const [sound, setSound] = useState('STOPPED');
  const [waterOn, setWaterOn] = useState(false);

  useEffect(() => {
    if (currentCycle < cycles) {
      const newTimers = [];
      newTimers.push(10); // 3 minutes in seconds for turning on water
      newTimers.push(10); // 9 minutes in seconds for washing
      setTimers(newTimers);
    }
  }, [cycles, currentCycle]);

  useEffect(() => {
    if (timers[currentCycle] === 0) {
      setSound('PLAYING');
    }
  }, [timers, currentCycle]);

  const decreaseTimer = () => {
    setTimers(prevTimers => {
      return prevTimers.map((timer, index) => {
        if (index === currentCycle) {
          return timer - 1;
        }
        return timer;
      });
    });
    if (timers[currentCycle] === 180 || timers[currentCycle] === 360) {
      setSound('PLAYING');
    }
  };

  const handleCyclesChange = (e) => {
    const newCycles = parseInt(e.target.value);
    setCycles(newCycles);
    setCurrentCycle(0);
  };

  const handleStartClick = () => {
    setCurrentCycle(0);
    setWaterOn(true);
  };

  useEffect(() => {
    let interval;
    if (currentCycle < cycles) {
      interval = setInterval(() => {
        decreaseTimer();
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [currentCycle, cycles]);

  return (
    <div>
      <h1>Manual Washing Machine</h1>
      <label htmlFor="cycles">Number of wash cycles:</label>
      <input
        type="number"
        id="cycles"
        value={cycles}
        onChange={handleCyclesChange}
      />
      <button onClick={handleStartClick}>Start Washing</button>
      <div>
        {timers.map((timer, index) => (
          <div key={index}>
            {currentCycle === index && (
              <p>Time remaining for {index === 0 ? 'turning on water' : 'washing'}: {Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' : ''}{timer % 60}</p>
            )}
          </div>
        ))}
      </div>
      <Sound
        url={require('./assets/001.wav')}
        playStatus={sound}
        onFinishedPlaying={() => setSound('STOPPED')}
      />
      {waterOn && <p>Water is on.</p>}
    </div>
  );
}

export default App;
