import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      const uploadedFile = acceptedFiles[0];
      setFile(uploadedFile);
      setPreview(URL.createObjectURL(uploadedFile));
      setResult(null);
      setError(null);
    },
  });
  const uploadImage = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        "http://localhost:8000/predict",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResult(response.data);
    } catch (error) {
      console.error(error);
      setError("Prediction failed try again!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center p-4">
      <motion.h1
        className="text-4xl font-extrabold mb-8 text-green-700 drop-shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        🥔 Potato Disease Classifier
      </motion.h1>
      <motion.div
        {...getRootProps()}
        className={`w-full max-w-md p-6 border-2 border-dashed rounded-3xl bg-white shadow-xl cursor-pointer transition
          ${isDragActive ? "border-green-500 bg-green-50" : "border-gray-300"}`}
        whileHover={{ scale: 1.02 }}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          {preview ? (
            <motion.img
              src={preview}
              alt="uploaded"
              className="mx-auto max-h-64 mb-4 rounded-2xl object-contain"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
          ) : (
            <p className="text-gray-500 font-medium">
              Drag and Drop an image here <br /> or click to select
            </p>
          )}
        </div>
      </motion.div>
      {file && (
        <motion.button
          onClick={uploadImage}
          className="mt-6 px-8 py-3 bg-green-500 text-white font-semibold rounded-full shadow-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
        >
          {loading ? (
            <div className="flex- items-center gap-2">
              <Spinner />
              predicting...
            </div>
          ) : (
            "Predict"
          )}
        </motion.button>
      )}
      {/* Result */}
      {result && (
        <motion.div
          className="mt-8 bg-white p-6 rounded-3xl shadow-2xl w-full max-w-md text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            {result.class}
          </h2>
          <p className="text-gray-600 text-lg">
            Confidence:{" "}
            <span className="font-semibold">
              {(result.confidence * 100).toFixed(2)}%
            </span>
          </p>
        </motion.div>
      )}

      {/* Error Toast */}
      {error && (
        <motion.div
          className="fixed bottom-6 right-6 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}
    </div>
  );
}

// Spinner Component
function Spinner() {
  return (
    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
  );
}
