from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report
from sklearn import metrics
from sklearn import tree
import pickle
import requests
import warnings

import sys
from json import *
from flask_cors import CORS, cross_origin
import random

warnings.filterwarnings("ignore")

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Connect to MongoDB (Replace with your actual connection string)
client = MongoClient("mongodb://localhost:27017/")
db = client["your_database_name"]
collection = db["your_collection_name"]

# Route to fetch all data
@app.route("/get-data", methods=["GET"])
def get_data():
    data = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB `_id`
    return jsonify(data)

# Route to add data
@app.route("/add-data", methods=["POST"])
def add_data():
    data = request.json  # Get JSON data from frontend
    collection.insert_one(data)
    return jsonify({"message": "Data added successfully!"}), 201

# Run the app
if __name__ == "__main__":
    app.run(debug=True)
