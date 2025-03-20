const mqtt = require('mqtt');
const { Client } = require('pg');
require('dotenv').config();

const mqttOptions = {
    host: process.env.MQTT_HOST,
    port: process.env.MQTT_PORT,
    protocol: 'mqtts',
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD
};

const pgClient = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }  
});

pgClient.connect()
    .then(() => console.log('Connected to NeonSQL'))
    .catch(err => console.error('NeonSQL Connection Error:', err));

const mqttClient = mqtt.connect(mqttOptions);

mqttClient.on('connect', function () {
    console.log('Connected to MQTT');
    mqttClient.subscribe(process.env.MQTT_TOPIC, function (err) {
        if (!err) {
            console.log('Subscribed to SENSOR/DATA topic');
        }
    });
});

mqttClient.on('error', function (error) {
    console.error('MQTT Error:', error);
});

async function insertIntoNeonSQL(data) {
    try {
        const query = `
            INSERT INTO water_quality (
                area, areaname, ph, turbidity, watertemperature, 
                totaldissolvedsolids, conductivity, chlorine, fluoride, target
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;

        const values = [
            data["area"], 
            data["areaname"], 
            data["ph"], 
            data["turbidity"], 
            data["watertemperature"], 
            data["totaldissolvedsolids"], 
            data["conductivity"], 
            data["chlorine"], 
            data["fluoride"], 
            data["target"]
        ];

        await pgClient.query(query, values);
        console.log("Data inserted into NeonSQL successfully.");
    } catch (error) {
        console.error("NeonSQL Insertion Error:", error);
    }
}


mqttClient.on('message', function (topic, message) {
    console.log('Received message:', topic, message.toString());

    try {
        const jsonString = message.toString().replace(/'/g, '"'); 
        const data = JSON.parse(jsonString);

        console.log("Parsed Data:", data);

        // Insert data into NeonSQL
        insertIntoNeonSQL(data);
    } catch (error) {
        console.error('Message Parsing Error:', error);
    }
});
