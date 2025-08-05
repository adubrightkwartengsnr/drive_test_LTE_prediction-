from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import uvicorn
from tensorflow import keras
import joblib



# Create an instance of FastAPI
app = FastAPI(
    title="Drive Test Prediction API",
    description="Predicts RSRP, RSRQ, and SNR values for drive test data using DEEP learning models.",
    version="1.0.0",
    contact={
        "name": "Team Selenium",
        "email": "teamseleniumapisupport@example.com",
    }
)

# Load model components
def load_ml_components():
    model = keras.models.load_model("../saved_models\drive_test_prediction.keras.zip")
    # Load the model components
    model_components = joblib.load("../saved_models/model_components.joblib")

    return model, model_components

 # load model components
model_components = load_ml_components()


@app.get("/")
def get_api_status():
    return {"status": "API is running"}


# Create IncomeStatus Features 
class DriveTestFeatures(BaseModel):
    # Define Features for the prediction
    Longitude: float
    Latitude: float
    Speed: int
    CellID: int
    CQI: float
    RSSI: float
    DL_bitrate: int
    UL_bitrate: int
    NRxRSRPr: float
    NRxRSRQ: float
    ServingCell_Lon: int
    ServingCell_Lat: float
    ServingCell_Distance: float
    Mode_of_Transport: str
    
    

# Create an endpoint for the the prediction
@app.post("/predict/drive_test_prediction")
async def drive_test_prediction(data:DriveTestFeatures):
    try:
        # create dataframe from prediction features
        df = pd.DataFrame([data.model_dump()])
        # load the preprocessor
        _,preprocessor = model_components["preprocessor"]
        # preprocess the data
        df = preprocessor.transform(df)
        # call the model from the ml model
        model,_ = model
        # make prediction
        prediction = model.predict(df)
        # inverse the prediction
        _,inverse_prediction = model_components["y_scaler"].inverse_transform([prediction])[0]
    
        response = {
                    "prediction": inverse_prediction,
                    }
        return response
    except Exception as e:
        return {"error":str(e)}

