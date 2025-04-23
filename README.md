# DA353 IoT Group Project
# IoT-Based Drinking Water Quality Monitoring System

## Overview

This project presents an IoT-based solution for real-time water quality monitoring across a college campus. Utilizing ESP32 microcontrollers, the system simulates multiple water quality parameters (pH, turbidity, chlorine levels, TDS, conductivity, fluoride content, and water temperature) for different campus locations including hostels (with specific blocks B1, B2, B3, B4) and academic core areas. The simulated data is transmitted via MQTT to a Mosquitto broker, where our backend server receives and processes the information in real-time. All water quality readings are stored in a PostgreSQL database along with location identifiers. An integrated machine learning model analyzes the incoming parameters to predict water potability and safety status. 

The system features an interactive web dashboard that visualizes current water quality metrics, safety classifications, historical trends, and statistical insights across all monitored campus locations. Users can filter data by specific buildings or blocks to target monitoring efforts and quickly identify potential water quality issues.

## Features

- *Synthetic Data Generation*: Simulates realistic water quality parameters (pH, turbidity, chlorine levels, TDS, conductivity, fluoride content, and water temperature) for multiple campus locations, accounting for variations based on building type and location.
- *MQTT Communication*: Employs the Mosquitto MQTT broker for efficient and reliable data transmission from M5Stack devices to the server.
- *Real-time Processing*: Continuously monitors the MQTT topics to process incoming data immediately as it's published by the M5Stack devices.
- *Web Dashboard*: A user-friendly interface that displays current water quality metrics, safety status, and historical trends for each campus location.
- *ML-based Safety Classification*: Implements a machine learning model to analyze water quality parameters and predict water potability, providing immediate safety assessments for each location.
- *Location-based Filtering*: Enables users to view and analyze water quality data by specific hostels, blocks, or academic areas across the campus.

## Project Structure

- main.py: MicroPython code for ESP32 devices to publish data via MQTT.
- app.py: Flask application handling data reception, storage, and visualization.
- models/: Pre-trained machine learning models for anomaly detection.
- scalers/: Pre-trained scalers for scaling inputs.
- templates/: Contains index.html frontend page for the website.

## Getting Started

### Prerequisites

- Python
- Flask
- pandas
- numpy
- scikit-learn
- paho-mqtt
- matplotlib
- MicroPython firmware for ESP32

### Data Generation and modelling

Navigate to the IOT_project_modelling.ipynb and run the script to generate synthetic data and get models and scalers:

This will create a CSV file containing the simulated energy consumption data and will save te models and scalers so that u can download and use then in backend server.

### Deploying the Flask Server

bash
python app.py


The web interface will be accessible at http://localhost:5000.

### Starting Mosquitto Server

bash
mosquitto.exe -v -c mosquitto.conf


### Configuring ESP32 Devices

Flash the MicroPython firmware onto your ESP32 devices. Upload the main.py script to each device. Ensure that the devices are connected to the same network as the Flask server and are configured to publish data to the correct MQTT broker address.

## Usage

1. *Select a Building*: Use the sidebar in the web interface to choose a building.
2. *View Energy Consumption*: Observe the hourly energy consumption plot for the selected building.
3. *Analyze Anomalies*: Review the anomaly table to identify any unusual energy usage patterns detected by the Random Forest model.

## Machine Learning Model

The XGBoost classifier is trained on the water quality dataset to assess water potability across campus locations. The model evaluates each set of water quality parameters and classifies water samples as safe or unsafe based on learned patterns from historical data. Performance metrics such as accuracy, precision, recall, and F1-score are computed to assess the model's effectiveness in correctly identifying potentially unsafe water conditions. This machine learning approach enables water quality management by providing safety classifications in real-time as new measurements are received from various campus locations.