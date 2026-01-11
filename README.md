# Mobile Temperature Reader  
**ESP32 + DHT11 + OLED + Express + React**

A full-stack IoT project that reads temperature and humidity from an ESP32, displays the values locally on an OLED screen, and publishes the data to a cloud-hosted backend for real-time visualization in a web application.

---

## Hardware Setup (Required)

![ESP32 DHT11 OLED Circuit](images/circuit.jpg)

### Components Needed
1. **ESP32** - Microcontroller with built-in WiFi
2. **DHT11 Sensor** - Temperature and humidity sensor
3. **0.96 inch I2C OLED Display** - For local data visualization

### Wiring
- **DHT11**: Connect data pin to GPIO 4 on ESP32
- **OLED**: Connect SDA to GPIO 21, SCL to GPIO 22 (I2C pins)
- Power both sensors with 3.3V from ESP32

> ⚠️ This project requires the physical circuit to be built before deployment.

---

## How to Run This Project

### Prerequisites
- **Hardware**: ESP32, DHT11 sensor, OLED display (wired as shown above)
- **Software**: Arduino IDE, Node.js (v16+), npm or yarn

### Step 1: Set Up the ESP32 Firmware
1. Open Arduino IDE and install the required libraries:
   - `DHT sensor library` by Adafruit
   - `Adafruit_SSD1306` for OLED display
   - `Adafruit_GFX` for graphics
2. Open `esp32_firmware/esp32_firmware.ino`
3. Update WiFi credentials and backend URL in the code:
   ```cpp
   const char* ssid = "YOUR_WIFI_SSID";
   const char* password = "YOUR_WIFI_PASSWORD";
   const char* serverUrl = "YOUR_BACKEND_URL/api/temperature";
   ```
4. Connect your ESP32 via USB and upload the code
5. Open Serial Monitor (115200 baud) to verify connection

### Step 2: Deploy the Backend Server
1. Navigate to the `server/` directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Deploy to Render (or your preferred platform):
   - Create a new Web Service on Render
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `node index.js`
   - Note the deployed URL (e.g., `https://your-app.onrender.com`)
4. Update ESP32 firmware with this URL

### Step 3: Deploy the Frontend Dashboard
1. Navigate to the `web_dashboard/` directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the API endpoint in the React app to point to your backend
4. Build and deploy to Vercel:
   ```bash
   npm run build
   ```
   - Connect to Vercel via GitHub or use `vercel` CLI
   - Deploy the `dist/` folder

### Step 4: Test the System
1. Power on your ESP32 (ensure it's connected to WiFi)
2. Verify temperature/humidity readings on the OLED display
3. Open your deployed frontend URL
4. Confirm live data is displaying on the web dashboard

---

## System Architecture

```
ESP32 (DHT11 + OLED)
        |
        | HTTP POST (JSON)
        v
Express.js Backend (Render)
        |
        | HTTP GET
        v
React + Vite Frontend (Vercel)
```

---

## Project Structure

```
Mobile-Temperature-Reader/
├── esp32_firmware/          # ESP32 Arduino code
├── server/                  # Express.js backend
├── web_dashboard/           # React + Vite frontend
└── images/                  # Circuit diagrams
```

---

## Component Explanations

### 1. ESP32 Firmware (`esp32_firmware/`)

The ESP32 code handles sensor reading, local display, and cloud communication.

**Key Functions:**
- **Sensor Reading**: Uses the DHT11 library to read temperature (°F) and humidity (%) every 2 seconds
- **OLED Display**: Shows real-time readings on the 128x64 I2C OLED screen with formatted text and degree symbols
- **WiFi Connection**: Connects to your local network and maintains connection with automatic reconnection logic
- **HTTP Client**: Sends POST requests to the backend API with JSON payload containing temperature and humidity data
- **Error Handling**: Includes retry logic for failed sensor reads and HTTP requests

**Libraries Used:**
- `WiFi.h` - ESP32 WiFi functionality
- `HTTPClient.h` - HTTP POST requests
- `DHT.h` - DHT11 sensor interface
- `Adafruit_SSD1306.h` & `Adafruit_GFX.h` - OLED display control

**Configuration:**
- DHT sensor on GPIO 4
- OLED I2C address: 0x3C
- Update interval: 2000ms
- Screen dimensions: 128x64

---

### 2. Express.js Backend (`server/`)

A lightweight Node.js server that acts as the data bridge between the ESP32 and web dashboard.

**Key Features:**
- **RESTful API**: Provides endpoints for receiving sensor data and serving it to the frontend
- **In-Memory Storage**: Stores the latest temperature and humidity reading (can be extended to use a database)
- **CORS Enabled**: Allows cross-origin requests from the frontend deployed on a different domain
- **Timestamp Tracking**: Records when each reading was received for data freshness validation

**API Endpoints:**
- `POST /api/temperature` - Receives sensor data from ESP32
  ```json
  {
    "temperature": 72.5,
    "humidity": 45.2
  }
  ```
- `GET /api/temperature` - Returns latest reading to frontend
  ```json
  {
    "temperature": 72.5,
    "humidity": 45.2,
    "timestamp": "2025-01-11T10:30:00.000Z"
  }
  ```

**Technologies:**
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `body-parser` - JSON request parsing

**Deployment**: Optimized for Render.com with automatic restarts and health checks

---

### 3. React Frontend (`web_dashboard/`)

A modern, responsive web application built with React and Vite for real-time data visualization.

**Key Features:**
- **Auto-Refresh**: Polls the backend API every 5 seconds for the latest sensor data
- **Responsive Design**: Clean, mobile-friendly interface with CSS styling
- **Data Display**: Shows temperature in Fahrenheit and humidity percentage with visual formatting
- **Status Indicators**: Displays connection status and last update time
- **Error Handling**: Gracefully handles API failures and displays user-friendly error messages

**Component Structure:**
- **App.jsx**: Main component with data fetching logic and state management
- **CSS Styling**: Custom styles for cards, gradients, and responsive layout
- **Vite Configuration**: Fast development server and optimized production builds

**Technologies:**
- `React 18` - UI library
- `Vite` - Build tool and dev server
- `fetch API` - HTTP requests to backend
- `useState` & `useEffect` - React hooks for state and lifecycle management

**Features:**
- Automatic polling with configurable intervals
- Temperature and humidity cards with color-coded backgrounds
- Timestamp display showing data freshness
- Loading states and error messages

---

## Technologies Used

**Hardware:**
- ESP32 DevKit
- DHT11 Temperature/Humidity Sensor
- 0.96" I2C OLED Display (SSD1306)

**Software:**
- Arduino IDE & C++ (ESP32 firmware)
- Node.js & Express.js (Backend API)
- React & Vite (Frontend dashboard)
- Render (Backend hosting)
- Vercel (Frontend hosting)

---

## Acknowledgments

This is my first electronics project combining IoT hardware with full-stack web development. Built to learn circuit design, embedded programming, and cloud deployment.
