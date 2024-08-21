// import { spawn } from 'child_process';
// import Image from '../models/image.js'; // Assuming you have a model named 'Image' for storing image details
// import path from 'path';

// const __dirname = path.resolve();

// export const uploadImage = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: 'Please upload an image' });
//         }
//         const { userId } = req.body;
//         const imageUrl = req.file.path;

//         // Save the image details to the database
//         const image = new Image({
//             userId,
//             imageUrl
//         });
//         await image.save();

//         const scriptPath = path.resolve(__dirname, 'scripts', 'MLmodel.py');

//         // Pass the uploaded image path to the ML model for prediction
//         const process = spawn('python', [scriptPath, imageUrl]);
//         let prediction = '';
//         process.stdout.on('data', (data) => {
//             prediction += data.toString();
//         });

//         process.stderr.on('data', (data) => {
//             console.error(data.toString());
//         });

//         // Handle completion of the Python script execution
//         process.on('close', (code) => {
//             // Send prediction to frontend
//             res.status(201).json({ message: 'Image uploaded successfully', prediction });
//         });
//     } catch (error) {
//         console.error('Error uploading image:', error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };
// import { spawn } from "child_process";
// import Image from "../models/image.js";
// import path from "path";

// const __dirname = path.resolve();

// export const uploadImage = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "Please upload an image" });
//     }
//     const { userId } = req.body;
//     const imageUrl = req.file.path;

//     // Save the image details to the database
//     const image = new Image({
//       userId,
//       imageUrl,
//     });
//     await image.save();

//     const scriptPath = path.resolve(__dirname, "scripts", "model.py");

//     // Pass the uploaded image path to the ML model for prediction
//     const process = spawn("python", [scriptPath, imageUrl]);

//     let predictionResult = "";

//     process.stdout.on("data", (data) => {
//       predictionResult += data.toString();
//       console.log(predictionResult);
//     });

//     process.stderr.on("data", (data) => {
//       console.error(data.toString());
//     });
//     process.on("close", (code) => {
//       console.log(`child process exited with code ${code}`);
//       (async () => {
//             const matches = predictionResult.match(/Predicted Diseases: \[\'(.*?)\'\]/);
//             const predictedDiseases = matches ? matches[1] : ''; //Extracting the predicted diseases from the matches
      
//             // Save the predicted diseases to the database
//             try {
//               image.prediction = predictedDiseases;
//               await image.save();
//               res.status(201).json({ message: "Image uploaded successfully",predictedDiseases });
//         } catch (error) {
//           console.error("Error saving prediction result:", error);
//           res.status(500).json({ message: "Error saving prediction result" });
//         }
//       })();
//     });

//     res.status(201).json({ message: "Image uploaded successfully" });
//   } catch (error) {
//     console.error("Error uploading image:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// import { spawn } from "child_process";
// import Image from "../models/image.js";
// import path from "path";
// const __dirname = path.resolve();

// export const uploadImage = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "Please upload an image" });
//     }
//     const { userId } = req.body;
//     const imageUrl = req.file.path;

//     // Save the image details to the database
//     const image = new Image({
//       userId,
//       imageUrl,
//     });
//     await image.save();

//     const scriptPath = path.resolve(__dirname, "scripts", "model.py");

//     // Pass the uploaded image path to the ML model for prediction
//     const process = spawn("python", [scriptPath, imageUrl]);

//     let predictionResult = "";

//     process.stdout.on("data", (data) => {
//       predictionResult += data.toString();
//       console.log(predictionResult);
//     });

//     process.stderr.on("data", (data) => {
//       console.error(data.toString());
//     });
//     process.on("close", async (code) => {
//       console.log(`child process exited with code ${code}`);
//       const matches = predictionResult.match(/Predicted Diseases: \[\'(.*?)\'\]/);
//       const predictedDiseases = matches ? matches[1] : ''; //Extracting the predicted diseases from the matches
  
//       // Save the predicted diseases to the database
//       try {
//         image.prediction = predictedDiseases;
//         await image.save();
//         res.status(201).json({ message: "Image uploaded successfully", predictedDiseases });
//       } catch (error) {
//         console.error("Error saving prediction result:", error);
//         res.status(500).json({ message: "Error saving prediction result" });
//       }
//     });
//   } catch (error) {
//     console.error("Error uploading image:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };


// export const getPredictions = async (req, res) => {
//   const userId = req.params.userId;
//   console.log(userId)
//   try {
//     const predictions = await Image.find({ userId: userId }, "prediction");
//     console.log("Predictions:", predictions);
//     res.json(predictions);
//   } catch (error) {
//     console.error("Error fetching predictions:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

import { spawn } from 'child_process';
import Image from '../models/image.js'; 
import path from 'path';
const __dirname = path.resolve();
export const uploadImage = async (req, res) => {
  const { userId, imageUrl } = req.body;

  try {
    // Save the image details to the database
    const newImage = new Image({
      userId,
      imageUrl,
    });
    const savedImage = await newImage.save();

    // Pass the uploaded image path to the ML model for prediction
    const scriptPath = path.resolve(__dirname, "scripts", "model.py");
    const process = spawn("python", [scriptPath, imageUrl]);

    let predictionResult = "";

    process.stdout.on("data", (data) => {
      console.log(data.toString());
      predictionResult += data.toString();
    });

    process.stderr.on("data", (data) => {
      console.error(data.toString());
    });

    process.on("close", async (code) => {
      console.log(`child process exited with code ${code}`);
      const matches = predictionResult.match(/Predicted Diseases: \[\'(.*?)\'\]/);
      const predictedDiseases = matches ? matches[1] : ''; 

      // Save the prediction result to the database
      try {
        newImage.prediction = predictedDiseases;
        await newImage.save();
        // Combine image upload response and prediction result
        res.status(201).json({ success: true, message: "Image uploaded successfully", image: savedImage, predictedDiseases });
      } catch (error) {
        console.error("Error saving prediction result:", error);
        res.status(500).json({ success: false, message: "Error saving prediction result" });
      }
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

