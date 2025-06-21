from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware  # <-- ADD THIS
import uvicorn
import numpy as np
from PIL import Image
from io import BytesIO
import requests

classes_names = ["Early_blight", "Late_blight", "healthy"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (you can restrict later)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/ping")
async def ping():
    return {"message": "Hello, I am alive"}


def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image


@app.post("/predict")
async def predict(file: UploadFile = File(...)) -> dict:
    image = read_file_as_image(await file.read())
    image_batch = np.expand_dims(image, 0) 

    payload = {"instances": image_batch.tolist()}

    response = requests.post(
        "http://localhost:8501/v1/models/potato_model:predict", json=payload
    )

    if response.status_code != 200:
        return {"error": "Failed to get prediction from model"}

    prediction = response.json()
    predicted_class_idx = np.argmax(prediction["predictions"][0])
    confidence = np.max(prediction["predictions"][0])

    predicted_class = classes_names[predicted_class_idx]

    return {"class": predicted_class, "confidence": float(confidence)}


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
