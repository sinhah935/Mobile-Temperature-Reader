#include <Arduino.h>
#include "config.h"

#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_GFX.h>
#include <DHT.h>

// Pins Config and Constants 
#define DHTPIN 18
#define DHTTYPE DHT11
// Pin config for DHT11 From Left to Right: DATA, 3.3V, GND
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

#define OLED_SDA 21
#define OLED_SCL 22

DHT dht(DHTPIN, DHTTYPE);
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// WiFi
#include <WiFi.h>
#include <HTTPClient.h>
const char* ssid = WIFI_SSID;
const char* password = WIFI_PASSWORD;
const char* serverUrl = SERVER_URL;// Next.js endpoint

void setup() {
  Serial.begin(115200);
  dht.begin();

  Wire.begin(OLED_SDA, OLED_SCL); // SDA, SCL

  // OLED setup
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
     Serial.println("SSD1306 allocation failed");
    for(;;);
  }
  display.clearDisplay();

  // WiFi setup
  WiFi.begin(ssid, password);
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0,0);
  display.println("Connecting WiFi...");
  display.display();

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  display.clearDisplay();
  display.println("WiFi Connected!");
  display.display();
  delay(1000);
}

void loop() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  Serial.print("Temp: "); Serial.println(temp);
  Serial.print("Hum: "); Serial.println(hum);

  // Display
  display.clearDisplay();
  display.setCursor(0,0);
  display.printf("Temp: %.1f C\n", temp);
  display.printf("Hum : %.1f %%", hum);
  display.display();

  // Send to server
  if(WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    String json = "{\"temperature\": " + String(temp) + ", \"humidity\": " + String(hum) + "}";
    int code = http.POST(json);
    http.end();

    Serial.printf("POST %d\n", code);
  }

  delay(3000);
}
