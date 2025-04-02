import pickle
import numpy as np
import pandas as pd

from joblib import load

# Load models using joblib
model = load("ML_notebooks_and_models/gbc_model.pkl")
scaler_model = load("ML_notebooks_and_models/scaler_model.pkl")

    
def predict(data):
    for key,value in data.items():
        data[key] = float(value)
    x_test_df = pd.DataFrame(data, index=[0])
    x_test_df = scaler_model.transform(x_test_df)
    y_pred_prob = model.predict_proba(x_test_df)
    return y_pred_prob[0][1]


if __name__ == "__main__":
    x_test_my_data = {"ph":7.5 , "turbidity":0.167797 , "watertemperature":17.125, 
                   "totaldissolvedsolids":180, "conductivity":322, "chlorine":2.74, "fluoride":0.3870}

    print(predict(x_test_my_data))
    