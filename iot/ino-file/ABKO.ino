/*
 * =============================================
 *   SISTEM ABKO - Smart Storage Berbasis IoT
 *   Full System: Sensor + Relay + WiFi (Web Integration)
 *   Board  : ESP32S (WROOM-32)
 *   Library: HX711 (bogde), DHT sensor library (Adafruit),
 *            Adafruit Unified Sensor, ArduinoJson, WiFi, HTTPClient
 * =============================================
 *
 * Sekat 1 (Apel — ESP32-APEL-01):
 *   HX711  : DT=D27, SCK=D26  | CALIB: 212.32
 *   DHT11  : D17
 *   MQ135  : D35 (AO)
 *   Relay Fan Tiup  (Cooling) : D19  (NC, logika terbalik)
 *   Relay Fan Hisap (Exhaust) : D21  (NC, logika terbalik)
 *
 * Sekat 2 (Pisang — ESP32-PISANG-01):
 *   HX711  : DT=D5,  SCK=D4   | CALIB: -184.8125
 *   DHT22  : D16
 *   MQ135  : D34 (AO)
 *   Relay Fan Tiup  (Cooling) : D18  (NC, logika terbalik)
 *   Relay Fan Hisap (Exhaust) : D22  (NC, logika terbalik)
 *
 * Logika Relay (NC — Active LOW):
 *   Suhu > 31C   → Fan Tiup  NYALA (relay LOW)
 *   MQ   > 1200  → Fan Hisap NYALA (relay LOW)
 *   Mode MANUAL  → dikontrol via Web Dashboard
 *
 * Serial Commands:
 *   T  → Tare ulang semua load cell
 *   S1 → Tare sekat 1 saja
 *   S2 → Tare sekat 2 saja
 * =============================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "HX711.h"
#include "DHT.h"

// ══════════════════════════════════════════════
//   PENGATURAN WiFi & API
// ══════════════════════════════════════════════
const char* ssid     = "Limboto kost";
const char* password = "Limboto1";

// Ganti IP ini dengan IPv4 lokal laptop SERVER (yang menjalankan backend)
// Cek dengan: ipconfig → Wireless LAN adapter Wi-Fi → IPv4 Address
const String API_URL_BASE = "http://192.168.18.226:5010/api/v1/iot/telemetry";
const String API_CONTROL  = "http://192.168.18.226:5010/api/v1/iot/control/";

// ══════════════════════════════════════════════
//   PIN KONFIGURASI
// ══════════════════════════════════════════════

// Sekat 1 (Apel)
#define S1_HX_DT        27
#define S1_HX_SCK       26
#define S1_DHT_PIN      17
#define S1_MQ_PIN       35
#define S1_RELAY_TIUP   19   // Cooling Fan
#define S1_RELAY_HISAP  21   // Exhaust Fan

// Sekat 2 (Pisang)
#define S2_HX_DT        5
#define S2_HX_SCK       4
#define S2_DHT_PIN      16
#define S2_MQ_PIN       34
#define S2_RELAY_TIUP   18   // Cooling Fan
#define S2_RELAY_HISAP  22   // Exhaust Fan

// ══════════════════════════════════════════════
//   KONFIGURASI SISTEM
// ══════════════════════════════════════════════
#define S1_DHT_TYPE     DHT11
#define S2_DHT_TYPE     DHT22

#define CALIB_SEKAT1     212.32
#define CALIB_SEKAT2    -184.8125



// Relay NC: Active LOW
#define FAN_NYALA        LOW
#define FAN_MATI         HIGH

#define INTERVAL_READ    5000    // ms — baca & kirim setiap 5 detik
#define LC_SAMPLES       5       // sampel rata-rata load cell

// ══════════════════════════════════════════════
//   OBJEK SENSOR
// ══════════════════════════════════════════════
HX711 scale1;
HX711 scale2;
DHT   dht1(S1_DHT_PIN, S1_DHT_TYPE);
DHT   dht2(S2_DHT_PIN, S2_DHT_TYPE);

bool s1_hx_ready = false;
bool s2_hx_ready = false;
unsigned long lastReadTime = 0;

// Sekat 1 (Apel)
String modeA    = "auto";
bool coolingOnA = false;
bool exhaustOnA = false;
float tempThresholdA = 31.0;
int gasThresholdA = 1200;

// Sekat 2 (Pisang)
String modeB    = "auto";
bool coolingOnB = false;
bool exhaustOnB = false;
float tempThresholdB = 31.0;
int gasThresholdB = 1200;


// ============================================================
//  Helper: setFan — Active LOW relay, cetak status ke Serial
// ============================================================
void setFan(uint8_t pin, bool fanOn, const char* label) {
  digitalWrite(pin, fanOn ? FAN_NYALA : FAN_MATI);
  Serial.printf("    [%-22s] %s\n", label, fanOn ? "NYALA" : "MATI");
}

// ============================================================
//  setupWiFi — sambungkan ke AP, tahan hingga terhubung
// ============================================================
void setupWiFi() {
  Serial.print("Menghubungkan ke WiFi");
  WiFi.disconnect(true);
  delay(1000);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n[WiFi] Terhubung!");
  Serial.print("[WiFi] IP Address: ");
  Serial.println(WiFi.localIP());
}

// ============================================================
//  sendToWeb — POST sensor ke backend, parse respons control
// ============================================================
void sendToWeb(String deviceId,
               float temp, float hum, int gas, float weight,
               String &refMode, bool &refCool, bool &refExhaust,
               float &refTempThresh, int &refGasThresh) {

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("  [HTTP] WiFi tidak terhubung, skip kirim.");
    return;
  }

  HTTPClient http;
  http.begin(API_URL_BASE);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(5000);  // timeout 5 detik

  // Buat JSON payload sesuai format backend
  StaticJsonDocument<256> doc;
  doc["deviceId"]     = deviceId;
  doc["fruitType"]    = (deviceId == "ESP32-APEL-01") ? "apel" : "pisang";
  doc["temperatureC"] = temp;
  doc["humidityPct"]  = hum;
  doc["gasValue"]     = gas;
  doc["weightGram"]   = weight;

  String body;
  serializeJson(doc, body);

  Serial.printf("  [HTTP] POST %s ...", deviceId.c_str());
  int httpCode = http.POST(body);

  if (httpCode > 0) {
    Serial.printf(" %d OK\n", httpCode);
    String responseStr = http.getString();

    StaticJsonDocument<512> resp;
    DeserializationError err = deserializeJson(resp, responseStr);

    if (!err) {
      // Struktur respons: { data: { control: { fanMode, coolingFanOn, exhaustFanOn } } }
      if (resp.containsKey("data") && resp["data"].containsKey("control")) {
        refMode    = resp["data"]["control"]["fanMode"].as<String>();
        refCool    = resp["data"]["control"]["coolingFanOn"].as<bool>();
        refExhaust = resp["data"]["control"]["exhaustFanOn"].as<bool>();
        if (resp["data"]["control"].containsKey("tempThreshold")) {
          refTempThresh = resp["data"]["control"]["tempThreshold"].as<float>();
        }
        if (resp["data"]["control"].containsKey("gasThreshold")) {
          refGasThresh = resp["data"]["control"]["gasThreshold"].as<int>();
        }
        Serial.printf("    Web -> mode=%s cooling=%d exhaust=%d tempThresh=%.1f gasThresh=%d\n",
                      refMode.c_str(), (int)refCool, (int)refExhaust, refTempThresh, refGasThresh);
      }
    } else {
      Serial.printf("    [JSON] Parse error: %s\n", err.c_str());
    }
  } else {
    Serial.printf(" GAGAL: %s\n", http.errorToString(httpCode).c_str());
  }

  http.end();
}


// ============================================================
//  SETUP
// ============================================================
void setup() {
  Serial.begin(115200);
  delay(2000);

  Serial.println("\n=============================");
  Serial.println("  SISTEM ABKO - IoT + Web    ");
  Serial.println("=============================");

  // ── Relay — semua MATI dulu (cegah glitch saat boot) ──
  pinMode(S1_RELAY_TIUP,  OUTPUT); digitalWrite(S1_RELAY_TIUP,  FAN_MATI);
  pinMode(S1_RELAY_HISAP, OUTPUT); digitalWrite(S1_RELAY_HISAP, FAN_MATI);
  pinMode(S2_RELAY_TIUP,  OUTPUT); digitalWrite(S2_RELAY_TIUP,  FAN_MATI);
  pinMode(S2_RELAY_HISAP, OUTPUT); digitalWrite(S2_RELAY_HISAP, FAN_MATI);
  Serial.println("[RELAY] Semua fan OFF (startup).");

  // ── WiFi ──
  setupWiFi();

  // ── HX711 Sekat 1 (dengan retry) ──
  Serial.print("[HX711] Sekat 1 (DT=27, SCK=26): ");
  scale1.begin(S1_HX_DT, S1_HX_SCK);
  delay(500);
  bool s1_found = false;
  for (int i = 0; i < 10; i++) {
    if (scale1.is_ready()) { s1_found = true; break; }
    delay(300);
  }
  if (s1_found) {
    scale1.set_scale(CALIB_SEKAT1);
    delay(200);
    scale1.tare();
    s1_hx_ready = true;
    Serial.println("OK");
  } else {
    Serial.println("GAGAL — cek kabel!");
  }

  delay(500);

  // ── HX711 Sekat 2 (dengan retry) ──
  Serial.print("[HX711] Sekat 2 (DT=5,  SCK=4 ): ");
  scale2.begin(S2_HX_DT, S2_HX_SCK);
  delay(500);
  bool s2_found = false;
  for (int i = 0; i < 10; i++) {
    if (scale2.is_ready()) { s2_found = true; break; }
    delay(300);
  }
  if (s2_found) {
    scale2.set_scale(CALIB_SEKAT2);
    delay(200);
    scale2.tare();
    s2_hx_ready = true;
    Serial.println("OK");
  } else {
    Serial.println("GAGAL — cek kabel!");
  }

  // ── DHT ──
  dht1.begin();
  dht2.begin();
  Serial.println("[DHT]   Sekat1=DHT11(D17) | Sekat2=DHT22(D16) OK");

  // ── MQ135 ──
  analogReadResolution(12);
  Serial.println("[MQ135] Sekat1=D35 | Sekat2=D34 OK");

  Serial.println("-----------------------------");
  Serial.println("Threshold Suhu & Gas : Diatur dari Web Dashboard");
  Serial.println("-----------------------------");
  Serial.println("Perintah Serial:");
  Serial.println("  T  -> Tare ulang semua load cell");
  Serial.println("  S1 -> Tare sekat 1 saja");
  Serial.println("  S2 -> Tare sekat 2 saja");
  Serial.println("=============================\n");
  delay(2000);
}


// ============================================================
//  LOOP
// ============================================================
void loop() {

  // ── Cek perintah Serial (tare on-demand) ─────────────────
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    cmd.toUpperCase();

    if (cmd == "T") {
      if (s1_hx_ready) scale1.tare();
      if (s2_hx_ready) scale2.tare();
      Serial.println("[TARE] Semua sekat direset.\n");
    } else if (cmd == "S1") {
      if (s1_hx_ready) scale1.tare();
      Serial.println("[TARE] Sekat 1 direset.\n");
    } else if (cmd == "S2") {
      if (s2_hx_ready) scale2.tare();
      Serial.println("[TARE] Sekat 2 direset.\n");
    }
  }

  // ── Baca & kirim setiap INTERVAL_READ ────────────────────
  if (millis() - lastReadTime < INTERVAL_READ) return;
  lastReadTime = millis();

  // ─── 1. BACA SENSOR SEKAT 1 (Apel) ───────────────────────
  float tA = dht1.readTemperature();
  float hA = dht1.readHumidity();
  int   gA = analogRead(S1_MQ_PIN);
  float bA = (s1_hx_ready && scale1.is_ready()) ? scale1.get_units(LC_SAMPLES) : 0.0;
  if (bA < 0) bA = 0;

  bool errA = isnan(tA) || isnan(hA) || (tA == 0.0 && hA == 0.0);
  if (errA) { tA = 0; hA = 0; }

  // ─── 2. BACA SENSOR SEKAT 2 (Pisang) ─────────────────────
  float tB = dht2.readTemperature();
  float hB = dht2.readHumidity();
  int   gB = analogRead(S2_MQ_PIN);
  float bB = (s2_hx_ready && scale2.is_ready()) ? scale2.get_units(LC_SAMPLES) : 0.0;
  if (bB < 0) bB = 0;

  bool errB = isnan(tB) || isnan(hB) || (tB == 0.0 && hB == 0.0);
  if (errB) { tB = 0; hB = 0; }

  // ─── 3. TAMPILKAN KE SERIAL MONITOR ──────────────────────
  Serial.println("\n===========================================");
  Serial.println("          HASIL BACAAN SENSOR             ");
  Serial.println("===========================================");

  Serial.println("[SEKAT 1 — APEL]");
  if (errA) {
    Serial.println("  DHT11   : GAGAL BACA");
  } else {
    Serial.print("  Suhu    : "); Serial.print(tA, 1); Serial.println(" C");
    Serial.print("  Humidity: "); Serial.print(hA, 1); Serial.println(" %");
  }
  Serial.print("  MQ135   : "); Serial.print(gA); Serial.println(" / 4095");
  Serial.print("  Berat   : ");
  if (s1_hx_ready) { Serial.print(bA, 2); Serial.println(" gram"); }
  else Serial.println("TIDAK READY");

  Serial.println();

  Serial.println("[SEKAT 2 — PISANG]");
  if (errB) {
    Serial.println("  DHT22   : GAGAL BACA");
  } else {
    Serial.print("  Suhu    : "); Serial.print(tB, 1); Serial.println(" C");
    Serial.print("  Humidity: "); Serial.print(hB, 1); Serial.println(" %");
  }
  Serial.print("  MQ135   : "); Serial.print(gB); Serial.println(" / 4095");
  Serial.print("  Berat   : ");
  if (s2_hx_ready) { Serial.print(bB, 2); Serial.println(" gram"); }
  else Serial.println("TIDAK READY");

  // ─── 4. KIRIM KE BACKEND & TERIMA STATE KONTROL ──────────
  Serial.println("\n[MENGIRIM KE WEB BACKEND...]");
  sendToWeb("ESP32-APEL-01",   tA, hA, gA, bA, modeA, coolingOnA, exhaustOnA, tempThresholdA, gasThresholdA);
  sendToWeb("ESP32-PISANG-01", tB, hB, gB, bB, modeB, coolingOnB, exhaustOnB, tempThresholdB, gasThresholdB);

  // ─── 5. EKSEKUSI LOGIKA KIPAS ─────────────────────────────
  Serial.println("\n--- STATUS AKTUAL KIPAS ---");

  // Sekat 1 (Apel)
  // Mode AUTO  → sensor menentukan
  // Mode MANUAL → web dashboard menentukan
  if (modeA == "auto") {
    coolingOnA = (!errA && tA > tempThresholdA);
    exhaustOnA = (gA > gasThresholdA);
  }
  setFan(S1_RELAY_TIUP,  coolingOnA, "Cooling Apel (Tiup)");
  setFan(S1_RELAY_HISAP, exhaustOnA, "Exhaust Apel (Hisap)");

  // Sekat 2 (Pisang)
  if (modeB == "auto") {
    coolingOnB = (!errB && tB > tempThresholdB);
    exhaustOnB = (gB > gasThresholdB);
  }
  setFan(S2_RELAY_TIUP,  coolingOnB, "Cooling Pisang (Tiup)");
  setFan(S2_RELAY_HISAP, exhaustOnB, "Exhaust Pisang (Hisap)");

  Serial.println("===========================================\n");
}