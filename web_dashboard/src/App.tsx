import { useState, useEffect} from 'react'
import './App.css'

function App() {
  const [data, setData] = useState({ temperature: "-", humidity: "-" , timestamp: "-" } );

  useEffect(() => {

    const fetchData = async () => {
      const response = await fetch(`${import.meta.env.VITE_IP_ADDR}/api/data`);
      const json = await response.json();
      setData(json);
    }

    fetchData();

    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval) // Fetch data every 5 seconds

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
