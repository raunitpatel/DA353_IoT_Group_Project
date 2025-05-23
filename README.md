# DA353 IoT Group Project
# IoT-Based Drinking Water Quality Monitoring System

## Overview

This project presents an IoT-based solution for real-time water quality monitoring across a college campus. Utilizing ESP32 microcontrollers, the system simulates multiple water quality parameters (pH, turbidity, chlorine levels, TDS, conductivity, fluoride content, and water temperature) for different campus locations including hostels (with specific blocks B1, B2, B3, B4) and academic core areas. The simulated data is transmitted via MQTT to a HiveMQ cloud broker, where our backend server receives and processes the information in real-time. All water quality readings are stored in a PostgreSQL database along with location identifiers. An integrated machine learning model analyzes the incoming parameters to predict water potability and safety status. 

The system features an interactive web dashboard that visualizes current water quality metrics, safety classifications, historical trends, and statistical insights across all monitored campus locations. Users can filter data by specific buildings or blocks to target monitoring efforts and quickly identify potential water quality issues.

## Features

- *Synthetic Data Generation*: Simulates realistic water quality parameters (pH, turbidity, chlorine levels, TDS, conductivity, fluoride content, and water temperature) for multiple campus locations, accounting for variations based on building type and location.
- *MQTT Communication*: Employs the HiveMQ cloud MQTT broker for efficient and reliable data transmission from M5Stack devices to the server.
- *Real-time Processing*: Continuously monitors the MQTT topics to process incoming data immediately as it's published by the M5Stack devices.
- *Web Dashboard*: A user-friendly interface that displays current water quality metrics, safety status, and historical trends for campus location.
- *ML-based Safety Classification*: Implements a machine learning model to analyze water quality parameters and predict water potability, providing immediate safety assessments for each location.
- *Location-based Filtering*: Enables users to view and analyze water quality data by specific hostels, blocks, or academic areas across the campus.

## Project Structure

- ML_notebooks_and_models: contain Model training and model weights.
- server.py: Provides the backend functionality for the dashboard, connecting to PostgreSQL to retrieve water quality data.
- src/: Contains all frontend files including HTML, CSS, and JavaScript.
- publish.py: Simulates data publishing from IoT sensors (random data generation for testing purposes) and send to server.
- subscribe.py: Subscribes to the published data, feeds it into the model, and performs predictions.

## Getting Started

### Prerequisites

- Python
- flask
- pandas
- numpy
- scikit-learn
- paho-mqtt
- ploty
- react
- MicroPython firmware for ESP32

### ⚙️ Installation

Follow these steps to set up the project locally:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/raunitpatel/DA353_IoT_Group_Project.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd DA353_IoT_Group_Project
   ```

3. **Create a Virtual Environment (Optional but Recommended)**

   ```bash
   python -m venv venv
   # Activate the environment
   source venv/bin/activate      # macOS/Linux
   venv\Scripts\activate         # Windows
   ```

4. **Install Python Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

5. **Navigate to the Frontend Folder and Install Node Modules**

   ```bash
   cd water_quality_prediction
   npm install
   ```

6. **Start the Frontend**

   ```bash
   npm start
   ```

7. **In a Separate Terminal, Start the Flask Server**

   ```bash
   cd server
   python app.py
   ```

8. **In Another Terminal, Run Publisher and Subscriber Scripts**

   ```bash
   python publish.py
   python subscribe.py
   ```


### Data Generation and modelling

The M5Stack devices generate realistic water quality parameter values for campus locations. This data is sent through MQTT to our server, where our XGBoost model analyzes it to predict water safety. All readings and predictions are stored in PostgreSQL for access by the web dashboard.

### Deploying the Flask Server

bash
python app.py


The web interface will be accessible at http://localhost:5000.

### Configuring ESP32 Devices

Flash the MicroPython firmware onto your ESP32 devices. Upload the main.py script to each device. Ensure that the devices are connected to the same network as the Flask server and are configured to publish data to the correct MQTT broker address.

## Usage

1. *Select an area*: Use the sidebar in the web interface to choose an area.
2. *View past data analytics*: Observe the plots for the selected area.

## Machine Learning Model

The XGBoost classifier is trained on the water quality dataset to assess water potability across campus locations. The model evaluates each set of water quality parameters and classifies water samples as safe or unsafe based on learned patterns from historical data. Performance metrics such as accuracy, precision, recall, and F1-score are computed to assess the model's effectiveness in correctly identifying potentially unsafe water conditions. This machine learning approach enables water quality management by providing safety classifications in real-time as new measurements are received from various campus locations.
