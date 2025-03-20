from flask import Flask, jsonify, request
from dotenv import load_dotenv 
load_dotenv()
from flask_cors import CORS
import psycopg2
import os

app = Flask(__name__)
CORS(app)


DB_URL = os.getenv("DATABASE_URL")
conn = psycopg2.connect(DB_URL)
cursor = conn.cursor()

@app.route("/areas", methods=["GET"])
def get_unique_areas():
    cursor.execute("SELECT DISTINCT Area, AreaName FROM water_quality;")
    records = cursor.fetchall()

    area_dict = {}
    for area, area_name in records:
        if area not in area_dict:
            area_dict[area] = []
        area_dict[area].append(area_name)

    menu_items = [{"title": area, "items": area_names} for area, area_names in area_dict.items()]
    
    return jsonify(menu_items)

@app.route("/data", methods=["POST"])
def get_filtered_data():
    try:
        data = request.get_json()
        area = data.get("area")
        area_name = data.get("areaName")
        print(area, area_name)

        if not area or not area_name:
            return jsonify({"error": "Missing area or areaName"}), 400

        cursor.execute("SELECT * FROM water_quality WHERE Area = %s AND AreaName = %s;", (area, area_name))
        columns = [desc[0] for desc in cursor.description]  
        records = cursor.fetchall()

        filtered_data = [dict(zip(columns, row)) for row in records]

        return jsonify(filtered_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
