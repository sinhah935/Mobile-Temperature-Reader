import { useState, useEffect, use} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [data, setData] = useState({ temperature: "-", humidity: "-" , timestamp: "-" } );

  useEffect(() => {

    const fetchData = async () => {
      const response = await fetch('http://10.239.221.125:3000/api/data');
      const json = await response.json();
      setData(json);
    }

    fetchData();

  }, []);


  return (
    <>
      <div>
        <h1> ESP32 Temperature Info</h1>
        {data ? (
          <div>
            <p>Temperature: {data.temperature} °C</p>
            <p>Humidity: {data.humidity} %</p>
            <p>Timestamp: {new Date(data.timestamp).toLocaleString()}</p>
          </div>
        ) : (
          <p>Loading data...</p>
        )}

      </div>
    </>
  )
}

export default App
