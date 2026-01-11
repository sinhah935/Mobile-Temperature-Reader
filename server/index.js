import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors())
app.use(bodyParser.json());

let latestData = { temperature: null, humidity: null, timestamp: null };

//Mock data for place holders
let tempData = { temperature: 25, humidity: 50, timestamp: new Date().toISOString() };

//ESP32 will send out POST requests to this endpoint with weather data
app.post('/api/data', (req, res) => {

    latestData = req.body;
    latestData.timestamp = new Date().toISOString();
    console.log("Receieved data:", latestData);
    res.json({ status: 'success' });
    
});

//REACT will GET the latest weather data from this endpoint
app.get('/api/data', (req, res) => {
    // tempData.timestamp = new Date().toISOString();
    res.json(latestData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


