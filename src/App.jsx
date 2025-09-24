import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

// import firebase
import { app, analytics } from "./firebase";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Firebase App:", app);
    console.log("Analytics:", analytics);
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + Firebase</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Firebase Connected ✅ — ดูผลลัพธ์ใน console
        </p>
      </div>
    </>
  );
}

export default App;
