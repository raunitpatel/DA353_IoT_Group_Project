import network
import time
import utime
import urandom
from umqtt.simple import MQTTClient
import ubinascii
import machine
import random

SERVER = b"b11c9daa741a4dc185be133c415d558b.s1.eu.hivemq.cloud"  
PORT = 0
USERNAME = b"ravit"
PASSWORD = b"Ravi1234"
CLIENT_ID = ubinascii.hexlify(machine.unique_id())
PUBLISH_TOPIC = b"SensorData"  

WIFI_SSID = "Ravi"
WIFI_PASSWORD = "qwertyui"

def connect_to_wifi(ssid, password):
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print('Connecting to WiFi...')
        wlan.connect(ssid, password)
        while not wlan.isconnected():
            pass
    print('WiFi connected:', wlan.ifconfig())
    return wlan

def generate_random_within_range(min_value, max_value):
    return round(urandom.uniform(min_value, max_value), 2)  

def generate_ph_value():
    ph_mean = 6.5
    ph_range = 3.4  
    ph_value = min(max(3.3, ph_mean + urandom.getrandbits(5) * ph_range / 512), 9.9)
    return round(ph_value, 2)

def publish_sensor_data(client):
    current_time = utime.time()
    print("a")
    area = random.choice(["HOSTEL"])
    area_code = random.choice(["Kameng", "Barak", "Umium"])
    print("b")
    turbidity = generate_random_within_range(0.5, 5.0) 
    water_temperature = generate_random_within_range(15, 30) 
    tds = generate_random_within_range(50, 500)  
    conductivity = generate_random_within_range(100, 1000)  
    chlorine = generate_random_within_range(0.1, 4.0)
    fluoride = generate_random_within_range(0.1, 1.5) 
    ph = generate_ph_value()
    print("c")
    data = {
        "Timestamp": current_time,
        "area": area,
        "areaname": area_code,
        "ph": ph,
        "turbidity": turbidity,
        "watertemperature": water_temperature,
        "totaldissolvedsolids": tds,
        "conductivity": conductivity,
        "chlorine": chlorine,
        "fluoride": fluoride,
        "target":1
    }
    
    client.publish("SENSOR/DATA", str(data))
    print("Published sensor data:", data)


if __name__ == '__main__':
    wlan = connect_to_wifi(WIFI_SSID, WIFI_PASSWORD)

    c = MQTTClient(CLIENT_ID, SERVER, port=PORT, user=USERNAME, password=PASSWORD, ssl=True, ssl_params={'server_hostname': SERVER})

    try:
        c.connect()
        print("Connected to MQTT broker:", SERVER)

        while True:
            publish_sensor_data(c)
            
            time.sleep(10)

    except Exception as e:
        print("Error:", e)

    finally:
        try:
            c.disconnect()
        except:
            pass