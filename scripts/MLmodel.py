from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import sys
import json

# Load the saved model
loaded_model = load_model(r"D:\Model_mobilev2\skin_disease_detection_model.h5")

class_labels = {
    # Your class labels
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

# Function to preprocess input image
def preprocess_image(image_path):
    img = image.load_img(image_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0  # Rescale to [0,1]
    return img_array

# Function to predict disease from input image
def predict_disease(image_path, model):
    preprocessed_img = preprocess_image(image_path)
    prediction = model.predict(preprocessed_img)
    predicted_class = np.argmax(prediction)
    return predicted_class

if __name__ == "__main__":
    # Get the image path from command-line argument
    input_image_path = sys.argv[1]
    # input_image_path = r"D:\Downloads\archive\test\Melanoma Skin Cancer Nevi and Moles\malignant-melanoma-82.jpg"


    # Get prediction from the input image
    predicted_class = predict_disease(input_image_path, loaded_model)

    # Decode the predicted class
    predicted_label = class_labels[predicted_class]

    # Print prediction
    # print("Predicted Class:", predicted_label)
    prediction_dict = {"prediction": predicted_label}
    
    prediction_json = json.dumps(prediction_dict)

    # Print the JSON string
    print(prediction_json)
