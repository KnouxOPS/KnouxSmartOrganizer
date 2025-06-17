const tf = require("@tensorflow/tfjs-node");
const faceapi = require("@vladmandic/face-api");
const Tesseract = require("tesseract.js");
const nsfwjs = require("nsfwjs");
const sharp = require("sharp");
const fs = require("fs-extra");
const path = require("path");
const blockhash = require("blockhash-core");

class AIEngine {
  constructor() {
    this.models = {
      faceapi: null,
      nsfw: null,
      ocr: null,
      classification: null,
    };
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    console.log("🧠 Initializing AI Engine...");

    try {
      // Initialize TensorFlow
      await tf.ready();

      // Load models in parallel
      await Promise.allSettled([
        this.loadFaceAPIModels(),
        this.loadNSFWModel(),
        this.initializeOCR(),
        this.loadClassificationModel(),
      ]);

      this.initialized = true;
      console.log("✅ AI Engine initialized successfully");
    } catch (error) {
      console.error("❌ AI Engine initialization failed:", error);
      throw error;
    }
  }

  async loadFaceAPIModels() {
    try {
      console.log("📥 Loading Face-API models...");

      // Load from local models directory
      const modelsPath = path.join(__dirname, "models", "face-api");
      await fs.ensureDir(modelsPath);

      // Download models if not exists
      if (
        !(await fs.pathExists(
          path.join(
            modelsPath,
            "tiny_face_detector_model-weights_manifest.json",
          ),
        ))
      ) {
        console.log("⬇️ Downloading Face-API models...");
        await this.downloadFaceAPIModels(modelsPath);
      }

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromDisk(modelsPath),
        faceapi.nets.faceLandmark68Net.loadFromDisk(modelsPath),
        faceapi.nets.faceRecognitionNet.loadFromDisk(modelsPath),
        faceapi.nets.faceExpressionNet.loadFromDisk(modelsPath),
        faceapi.nets.ageGenderNet.loadFromDisk(modelsPath),
      ]);

      this.models.faceapi = faceapi;
      console.log("✅ Face-API models loaded");
    } catch (error) {
      console.warn("⚠️ Face-API models failed to load:", error.message);
    }
  }

  async downloadFaceAPIModels(modelsPath) {
    const https = require("https");
    const modelFiles = [
      "tiny_face_detector_model-weights_manifest.json",
      "tiny_face_detector_model-shard1.bin",
      "face_landmark_68_model-weights_manifest.json",
      "face_landmark_68_model-shard1.bin",
      "face_recognition_model-weights_manifest.json",
      "face_recognition_model-shard1.bin",
      "face_expression_model-weights_manifest.json",
      "face_expression_model-shard1.bin",
      "age_gender_model-weights_manifest.json",
      "age_gender_model-shard1.bin",
    ];

    const baseUrl =
      "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/";

    for (const file of modelFiles) {
      const url = baseUrl + file;
      const filePath = path.join(modelsPath, file);

      try {
        await this.downloadFile(url, filePath);
        console.log(`Downloaded: ${file}`);
      } catch (error) {
        console.warn(`Failed to download ${file}:`, error.message);
      }
    }
  }

  downloadFile(url, filePath) {
    return new Promise((resolve, reject) => {
      const https = require("https");
      const file = fs.createWriteStream(filePath);

      https
        .get(url, (response) => {
          response.pipe(file);
          file.on("finish", () => {
            file.close();
            resolve();
          });
        })
        .on("error", (error) => {
          fs.unlink(filePath, () => {}); // Delete incomplete file
          reject(error);
        });
    });
  }

  async loadNSFWModel() {
    try {
      console.log("📥 Loading NSFW detection model...");
      this.models.nsfw = await nsfwjs.load();
      console.log("✅ NSFW model loaded");
    } catch (error) {
      console.warn("⚠️ NSFW model failed to load:", error.message);
    }
  }

  async initializeOCR() {
    try {
      console.log("📥 Initializing OCR (Tesseract)...");
      // Tesseract will auto-download language data on first use
      this.models.ocr = Tesseract;
      console.log("✅ OCR initialized");
    } catch (error) {
      console.warn("⚠️ OCR initialization failed:", error.message);
    }
  }

  async loadClassificationModel() {
    try {
      console.log("📥 Loading classification model...");
      // Use a lightweight MobileNet model
      const modelUrl =
        "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json";
      this.models.classification = await tf.loadLayersModel(modelUrl);
      console.log("✅ Classification model loaded");
    } catch (error) {
      console.warn("⚠️ Classification model failed to load:", error.message);
    }
  }

  async analyzeImage(imagePath) {
    console.log(`🔍 Analyzing: ${path.basename(imagePath)}`);

    try {
      // Load and preprocess image
      const imageBuffer = await fs.readFile(imagePath);
      const image = sharp(imageBuffer);
      const metadata = await image.metadata();

      // Get image for different models
      const rgbBuffer = await image.resize(224, 224).rgb().raw().toBuffer();
      const canvas = await this.createCanvasFromBuffer(rgbBuffer, 224, 224);

      // Run all analyses in parallel
      const [description, faces, nsfwResult, ocrResult, duplicateHash] =
        await Promise.allSettled([
          this.generateDescription(canvas),
          this.detectFaces(canvas),
          this.checkNSFW(canvas),
          this.extractText(imagePath),
          this.generatePerceptualHash(imageBuffer),
        ]);

      return {
        description:
          description.status === "fulfilled" ? description.value : "image",
        faces: faces.status === "fulfilled" ? faces.value : [],
        isNSFW: nsfwResult.status === "fulfilled" ? nsfwResult.value : false,
        nsfwScore:
          nsfwResult.status === "fulfilled" ? nsfwResult.value.score : 0,
        text: ocrResult.status === "fulfilled" ? ocrResult.value : "",
        duplicateHash:
          duplicateHash.status === "fulfilled" ? duplicateHash.value : "",
        metadata: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          size: (await fs.stat(imagePath)).size,
        },
      };
    } catch (error) {
      console.error(`Failed to analyze ${imagePath}:`, error);
      return {
        description: "unknown",
        faces: [],
        isNSFW: false,
        nsfwScore: 0,
        text: "",
        duplicateHash: "",
        metadata: {},
      };
    }
  }

  async createCanvasFromBuffer(buffer, width, height) {
    // Create a simple canvas-like object for compatibility
    return {
      width,
      height,
      data: buffer,
    };
  }

  async generateDescription(canvas) {
    if (!this.models.classification) {
      return this.simpleColorAnalysis(canvas);
    }

    try {
      // Convert canvas data to tensor
      const tensor = tf
        .tensor3d(Array.from(canvas.data), [canvas.height, canvas.width, 3])
        .expandDims(0)
        .div(255);

      const predictions = await this.models.classification.predict(tensor);
      const probabilities = await predictions.data();

      tensor.dispose();
      predictions.dispose();

      // Map to categories (simplified)
      const maxIndex = probabilities.indexOf(Math.max(...probabilities));
      const categories = [
        "nature",
        "food",
        "vehicle",
        "person",
        "animal",
        "building",
        "object",
        "document",
        "art",
        "screenshot",
      ];

      return categories[maxIndex % categories.length] || "general";
    } catch (error) {
      console.warn(
        "Classification failed, using color analysis:",
        error.message,
      );
      return this.simpleColorAnalysis(canvas);
    }
  }

  simpleColorAnalysis(canvas) {
    // Simple color-based classification
    const data = canvas.data;
    let r = 0,
      g = 0,
      b = 0;

    for (let i = 0; i < data.length; i += 3) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }

    const pixels = data.length / 3;
    r /= pixels;
    g /= pixels;
    b /= pixels;

    if (g > r && g > b && g > 100) return "nature";
    if (r > 150 && g > 100 && b < 100) return "food";
    if (b > r && b > g) return "screenshot";

    return "general";
  }

  async detectFaces(canvas) {
    if (!this.models.faceapi) {
      return this.simpleFaceDetection(canvas);
    }

    try {
      const detections = await faceapi
        .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();

      return detections.map((detection) => ({
        confidence: detection.detection.score,
        age: detection.age,
        gender: detection.gender,
        expressions: detection.expressions,
      }));
    } catch (error) {
      console.warn(
        "Face detection failed, using simple method:",
        error.message,
      );
      return this.simpleFaceDetection(canvas);
    }
  }

  simpleFaceDetection(canvas) {
    // Simple skin color detection
    const data = canvas.data;
    let skinPixels = 0;

    for (let i = 0; i < data.length; i += 3) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Simple skin color detection
      if (r > 80 && g > 50 && b > 40 && r > b && r > g) {
        skinPixels++;
      }
    }

    const skinRatio = skinPixels / (data.length / 3);
    return skinRatio > 0.15
      ? [{ confidence: 0.7, age: null, gender: null }]
      : [];
  }

  async checkNSFW(canvas) {
    if (!this.models.nsfw) {
      return { isNSFW: false, score: 0 };
    }

    try {
      // Convert canvas to tensor for NSFW model
      const tensor = tf.browser.fromPixels(canvas).expandDims(0);
      const predictions = await this.models.nsfw.classify(tensor);

      tensor.dispose();

      const nsfwClasses = ["Porn", "Hentai"];
      const nsfwScore = predictions
        .filter((p) => nsfwClasses.includes(p.className))
        .reduce((sum, p) => sum + p.probability, 0);

      return {
        isNSFW: nsfwScore > 0.6,
        score: nsfwScore,
      };
    } catch (error) {
      console.warn("NSFW detection failed:", error.message);
      return { isNSFW: false, score: 0 };
    }
  }

  async extractText(imagePath) {
    if (!this.models.ocr) {
      return "";
    }

    try {
      const worker = await Tesseract.createWorker();
      await worker.loadLanguage("eng+ara");
      await worker.initialize("eng+ara");

      const {
        data: { text },
      } = await worker.recognize(imagePath);
      await worker.terminate();

      return text.trim();
    } catch (error) {
      console.warn("OCR failed:", error.message);
      return "";
    }
  }

  async generatePerceptualHash(imageBuffer) {
    try {
      // Generate 8x8 grayscale thumbnail for hashing
      const grayBuffer = await sharp(imageBuffer)
        .resize(8, 8)
        .grayscale()
        .raw()
        .toBuffer();

      // Simple perceptual hash
      const average = Array.from(grayBuffer).reduce((a, b) => a + b) / 64;

      let hash = "";
      for (let i = 0; i < 64; i++) {
        hash += grayBuffer[i] > average ? "1" : "0";
      }

      return hash;
    } catch (error) {
      console.warn("Hash generation failed:", error.message);
      return "";
    }
  }

  categorizeImage(analysis) {
    const { description, faces, isNSFW, text } = analysis;

    // Priority-based categorization
    if (isNSFW) return "nsfw";
    if (faces.length > 0) return "selfies";
    if (text && text.length > 50) return "documents";
    if (description.includes("screenshot")) return "screenshots";
    if (description.includes("nature")) return "nature";
    if (description.includes("food")) return "food";

    return "general";
  }

  generateSmartFilename(analysis, originalPath) {
    const ext = path.extname(originalPath);
    const { description, faces, text } = analysis;

    let name = description.toLowerCase().replace(/[^a-z0-9]/g, "-");

    if (faces.length > 0) {
      name = `portrait-${name}`;
    }

    if (text && text.length > 0) {
      const firstWords = text
        .split(" ")
        .slice(0, 2)
        .join("-")
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "");
      if (firstWords) {
        name = `${firstWords}-${name}`;
      }
    }

    const timestamp = new Date().toISOString().slice(0, 10);
    name = `${name}-${timestamp}`;

    // Ensure reasonable length
    if (name.length > 50) {
      name = name.substring(0, 50);
    }

    return `${name}${ext}`;
  }
}

module.exports = { AIEngine };
