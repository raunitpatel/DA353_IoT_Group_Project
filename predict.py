import pickle
import numpy as np
import pandas as pd
from joblib import load

# Load models using joblib
model = load("ML_notebooks_and_models/gbc_model.pkl")
scaler_model = load("ML_notebooks_and_models/scaler_model.pkl")
ml_features = ["ph", "turbidity", "watertemperature", 
                "totaldissolvedsolids", "conductivity", "chlorine", "fluoride"]

    
def predict(data):
    data_test = {}
    for key in ml_features:
        data_test[key] = float(data[key])
    print(data_test)
    x_test_df = pd.DataFrame(data_test, index=[0])
    x_test_df = scaler_model.transform(x_test_df)
    y_pred_prob = model.predict_proba(x_test_df)
    return y_pred_prob[0][1]

    