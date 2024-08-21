import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from PIL import Image
import json
import sys
import requests
from io import BytesIO

class SimplifiedCapsuleNetwork(tf.keras.Model):
    def __init__(self, input_shape, num_classes):
        super(SimplifiedCapsuleNetwork, self).__init__()

        # Primary Capsule layer
        self.primary_capsules = tf.keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=input_shape)

        # Flatten Capsule layer
        self.flatten = tf.keras.layers.Flatten()

        # Fully Connected layers
        self.dense1 = tf.keras.layers.Dense(128, activation='relu')
        self.dense2 = tf.keras.layers.Dense(num_classes, activation='softmax')

    def call(self, inputs):
        x = self.primary_capsules(inputs)
        x = self.flatten(x)
        x = self.dense1(x)
        return self.dense2(x)

# Instantiate the model
input_shape = (224, 224, 3)
num_classes = 6  
capsnet_model = SimplifiedCapsuleNetwork(input_shape, num_classes)

# Call the model once to create its variables
dummy_input = tf.zeros((1, *input_shape))  # Create dummy input
_ = capsnet_model(dummy_input)  # Call the model once

# Load pre-trained weights
capsnet_model.load_weights(r"D:\ensemble_model\capsnet_model_weights_1.h5")

# Load pre-trained MobileNetV2 model
mobilenetv2_model = load_model(r"D:\Model_mobilev2\skin_disease_detection_model.h5")

# Define mapping from model output to disease names
disease_mapping = {
    0: 'Light Diseases and Disorders of Pigmentation',
    1: 'Lupus and other Connective Tissue diseases',
    2: 'Melanoma Skin Cancer Nevi and Moles',
    3: 'Nail Fungus and other Nail Disease',
    4: 'Vascular Tumors',
    5: 'Vasculitis Photos',
    6: 'Urticaria Hives',
    7: 'Scabies Lyme Disease and other Infestations and Bites',
    8: 'Hair Loss Photos Alopecia and other Hair Diseases',
    9: 'Cellulitis Impetigo and other Bacterial Infections',
    10: 'Bullous Disease Photos',
    11: 'Atopic Dermatitis Photos'
}

# Function to preprocess input data
def preprocess_input_data(input_data):
    img = image.load_img(input_data, target_size=(224, 224))  # Resize image to match input size of MobileNetV2
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    preprocessed_data = preprocess_input(img_array)  # Preprocess input using MobileNetV2's preprocess_input function
    return preprocessed_data

# Ensemble prediction function using voting
def ensemble_predict(input_data):
    # Preprocess input data
    preprocessed_data = preprocess_input_data(input_data)
    
    # Make predictions using each model
    mobilenetv2_pred = mobilenetv2_model.predict(preprocessed_data)
    capsnet_pred = capsnet_model.predict(preprocessed_data)
    
    # Apply voting ensemble technique
    ensemble_pred = np.argmax(mobilenetv2_pred + capsnet_pred, axis=1)
    
    # Convert model output to disease names
    predicted_diseases = [disease_mapping[pred] for pred in ensemble_pred]
    
    return predicted_diseases

# Function to fetch image from URL
def fetch_image_from_url(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            image_data = response.content
            return BytesIO(image_data)
        else:
            print("Failed to fetch image. Status code:", response.status_code)
            return None
    except Exception as e:
        print("An error occurred while fetching the image:", str(e))
        return None

if __name__ == "__main__":
    # Fetch image from URL
    if len(sys.argv) != 2:
        print("Usage: python model.py <image_url>")
        sys.exit(1)
    
    image_url = sys.argv[1]
    image_data = fetch_image_from_url(image_url)
    
    if image_data:
        # Process the image using your ensemble prediction function
        predicted_diseases = ensemble_predict(image_data)
        print("Predicted Diseases:", predicted_diseases)
    else:
        print("Failed to fetch image. Please check the URL.")

