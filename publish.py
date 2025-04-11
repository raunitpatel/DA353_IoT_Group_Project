import network
import time
import utime
import urandom
from umqtt.simple import MQTTClient
import ubinascii
import machine
import random
import numpy as np
# MQTT broker configuration
SERVER = b"b11c9daa741a4dc185be133c415d558b.s1.eu.hivemq.cloud"  ##check
PORT = 0
USERNAME = b"ravit"
PASSWORD = b"Ravi1234"
CLIENT_ID = ubinascii.hexlify(machine.unique_id())
PUBLISH_TOPIC = b"SensorData"  # Changed the topic to generalize it for all sensor data

# WiFi configuration
WIFI_SSID = "Ravi"
WIFI_PASSWORD = "qwertyui"

def connect_to_wifi(ssid, password):
    # Configure WiFi using Station Interface
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print('Connecting to WiFi...')
        wlan.connect(ssid, password)
        while not wlan.isconnected():
            pass
    print('WiFi connected:', wlan.ifconfig())
    return wlan

def generate_random_within_range(meanval, stddev):
    #Generat random number with normal distribution
    # meanval = 0.5
    # stddev = 0.5  
    
    return np.random.normal(loc=meanval, scale=stddev) # Generates floats

def generate_ph_value():
    # Generate random pH value within the specified range
    ph_mean = 6.5
    ph_range = 3.4  # Half of the range around the mean
    ph_value = min(max(3.3, ph_mean + urandom.getrandbits(5) * ph_range / 512), 9.9)
    # Round the pH value to two decimal places
    return round(ph_value, 2)

def publish_sensor_data(client):
    # Get current time
    current_time = utime.time()
    print("a")
    # Define areas and area codes
    area = random.choice(["HOSTEL"])
    area_code = random.choice(["Kameng", "Barak", "Umium"])
    print("b")
    # Generate values for parameters
    turbidity = generate_random_within_range(0.5, 5.0)  # NTU
    water_temperature = generate_random_within_range(15, 30)  # Celsius
    tds = generate_random_within_range(50, 500)  # ppm
    conductivity = generate_random_within_range(100, 1000)  # µS/cm
    chlorine = generate_random_within_range(0.1, 4.0)  # mg/L
    fluoride = generate_random_within_range(0.1, 1.5)  # mg/L
    ph = generate_ph_value(7)  # pH value
    print("c")
    # Prepare data payload
    data = {
        "Timestamp": current_time,
        "Area": area,
        "Area Code": area_code,
        "pH": ph,
        "Turbidity": turbidity,
        "Water Temperature": water_temperature,
        "Total Dissolved Solids": tds,
        "Conductivity": conductivity,
        "Chlorine": chlorine,
        "Fluoride": fluoride
    }
    
    # Publish data
    client.publish("SENSOR/DATA", str(data))
    print("Published sensor data:", data)


if __name__ == '__main__':
    # Connect to WiFi
    wlan = connect_to_wifi(WIFI_SSID, WIFI_PASSWORD)

    # Initialize MQTT client with TLS
    c = MQTTClient(CLIENT_ID, SERVER, port=PORT, user=USERNAME, password=PASSWORD, ssl=True, ssl_params={'server_hostname': SERVER})

    try:
        # Connect to MQTT broker
        c.connect()
        print("Connected to MQTT broker:", SERVER)

        while True:
            # Publish sensor data values
            publish_sensor_data(c)
            
            # Delay for 10 seconds
            time.sleep(10)

    except Exception as e:
        print("Error:", e)

    finally:
        # Disconnect MQTT client
        try:
            c.disconnect()
        except:
            pass