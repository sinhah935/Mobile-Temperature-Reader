import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors())
app.use(bodyParser.json());

let latestData = { temperature: null, humidity: null, timestamp: null };
let tempData = { temperature: 25, humidity: 50, timestamp: new Date().toISOString() };

//ESP32 will send out POST requests to this endpoint with weather data
app.post('/api/data', (req, res) => {

    latestData = req.body;
    latestData.timestamp = new Date().toISOString();
    console.log("Receieved data:", latestData);
    res.json({ status: 'success' });
    
});

app.get('/api/data', (req, res) => {
    res.json(tempData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});