import json
import ssl
import paho.mqtt.client as mqtt
import psycopg2
import os
from dotenv import load_dotenv
from data_validation import valid_data
from predict import predict

load_dotenv()  

pg_conn = psycopg2.connect(os.getenv("DATABASE_URL"), sslmode='require')
pg_cursor = pg_conn.cursor()

mqtt_broker = os.getenv("MQTT_HOST")
mqtt_port = int(os.getenv("MQTT_PORT", 8883))
mqtt_username = os.getenv("MQTT_USERNAME")
mqtt_password = os.getenv("MQTT_PASSWORD")
mqtt_topic = os.getenv("MQTT_TOPIC")

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("✅ Connected to MQTT Broker")
        client.subscribe(mqtt_topic)
        print(f"📡 Subscribed to topic: {mqtt_topic}")
    else:
        print(f"❌ Connection failed with code {rc}")

def on_message(client, userdata, message):
    json_string = message.payload.decode().replace("'", '"')  
    data = json.loads(json_string)
    if valid_data(data):
        y_pred = predict(data)
        data['target'] = y_pred
        insert_into_db(data)
        print("✅ Parsed Data:", data)
    

def insert_into_db(data):
    try:
        query = """
            INSERT INTO water_quality (
                area, areaname, block, ph, turbidity, watertemperature, 
                totaldissolvedsolids, conductivity, chlorine, fluoride, target
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            data["area"], 
            data["areaname"], 
            data["block"], 
            float(data["ph"]), 
            float(data["turbidity"]), 
            float(data["watertemperature"]), 
            float(data["totaldissolvedsolids"]), 
            float(data["conductivity"]), 
            float(data["chlorine"]), 
            float(data["fluoride"]), 
            float(data["target"])
        )

        print("📊 Preparing to insert data into the database...")
        print(f"📌 Insert Values: {values}")

        pg_cursor.execute(query, values)
        pg_conn.commit()
        print("✅ Data successfully inserted into NeonSQL.")

    except Exception as e:
        print(f"❌ Database Insertion Error: {e}")

mqtt_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1)
mqtt_client.tls_set_context(ssl.SSLContext(ssl.PROTOCOL_TLS))
mqtt_client.username_pw_set(mqtt_username, mqtt_password)
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

print("🚀 Connecting to MQTT broker...")
mqtt_client.connect(mqtt_broker, mqtt_port)

mqtt_client.loop_forever()
