# Potato Leaf Disease Detection System

A complete end‑to‑end application that classifies potato‑leaf images into **Early Blight**, **Late Blight**, or **Healthy** with **97 %+ accuracy**.
The backend is split into two layers:

1. **TensorFlow Serving** — hosts the trained model and exposes a REST/gRPC prediction API.
2. **FastAPI** — validates requests, forwards them to TensorFlow Serving, and returns user‑friendly responses.

The **React + Tailwind** frontend lets growers drag‑and‑drop leaf photos and view instant results.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
   1. [1 ◾ Clone & Setup](#1-clone--setup)
   2. [2 ◾ Serve the Model](#2-serve-the-model)
   3. [3 ◾ Run FastAPI](#3-run-fastapi)
   4. [4 ◾ Launch Frontend](#4-launch-frontend)
4. [Model Details](#model-details)
5. [Dataset](#dataset)
6. [Contributing](#contributing)
7. [License](#license)

---

## Demo

<p align="center">
  <img src="assets/demo.gif" alt="live preview" width="600">
</p>

---

## Project Structure

```
.
├── api/                    # FastAPI backend
│   └── main.py
├── data/                   # Raw images (optional, not required for inference)
├── frontend/               # React + Tailwind client
│   ├── src/
│   └── public/
├── saved_models/           # Keras & SavedModel artefacts
│   ├── my_model.keras      # For reference
│   └── 1/                  # TF‑Serving‑friendly version folder
│       ├── saved_model.pb
│       └── variables/
├── training/               # Jupyter notebooks / scripts
│   └── training.ipynb
├── requirements.txt
└── README.md               # ← you are here
```

_If you see `saved_models_1/1/…`, rename it to the structure shown above or update the TensorFlow Serving command._

---

## Prerequisites

| Tool       | Version (tested) | Notes                             |
| ---------- | ---------------- | --------------------------------- |
| Python     | 3.8 +            | FastAPI backend                   |
| Docker     | 20.10 +          | Runs TensorFlow Serving container |
| Node & npm | 20.x / 10.x      | React frontend                    |
| Git        | any              | clone the repo                    |

---

## Quick Start

### 1 ▪️ Clone & Setup

```bash
git clone https://github.com/<your‑user>/potato‑leaf‑disease‑detector.git
cd potato‑leaf‑disease‑detector

# (Optional) create a virtual env
python -m venv dl_env
source dl_env/bin/activate  # Windows: dl_env\Scripts\activate
pip install -r requirements.txt
```

### 2 ▪️ Serve the Model

```bash
docker run -p 8501:8501 \
  --name=tf‑potato‑serving \
  --mount type=bind,\
source=$(pwd)/saved_models,\
target=/models/potato_model \
  -e MODEL_NAME=potato_model \
  tensorflow/serving
```

- REST endpoint → `http://localhost:8501/v1/models/potato_model:predict`
- gRPC endpoint → `localhost:8500`

### 3 ▪️ Run FastAPI

```bash
cd api
uvicorn main:app --reload --port 8000
# Swagger/OpenAPI docs at:
# http://localhost:8000/docs
```

### 4 ▪️ Launch Frontend

```bash
cd ../frontend
npm install
npm run dev      # vite / next / cra → adjust if needed
# Default: http://localhost:3000
```

## Model Details

| Property            | Value                                  |
| ------------------- | -------------------------------------- |
| Architecture        | MobileNetV2 + custom head              |
| Input size          | 224 × 224 × 3                          |
| Output classes      | 3 (Early Blight, Healthy, Late Blight) |
| Loss / Optimizer    | Categorical CE / Adam                  |
| Data Augmentation   | flips, rotations, brightness           |
| Validation accuracy | **97.3 %** (± 0.4)                     |

The model is stored in **SavedModel** format for TensorFlow Serving and additionally in `.keras` format for archival.

---

## Dataset

- Derived from the **PlantVillage** open‑access dataset.
- 3 classes, ~3 200 images before augmentation.
- Training : Validation : Test split = 70 : 15 : 15.

---

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feat‑awesome`)
3. Commit your changes
4. Open a PR and describe **what** and **why**

Good first issues: adding unit tests, improving error messages, CI workflow.

---

## License

This repository is released under the **MIT License**.  
See [LICENSE](LICENSE) for details.
