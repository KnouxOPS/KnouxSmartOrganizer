import * as tf from "@tensorflow/tfjs";
import * as faceapi from "face-api.js";
import Tesseract from "tesseract.js";
import type {
  ImageAnalysis,
  FaceDetection,
  OCRResult,
  DetectedObject,
  ImageCategory,
  AIModel,
} from "@/types/organizer";

export class AIEngine {
  private models: Map<string, tf.LayersModel | any> = new Map();
  private modelStatus: Map<string, AIModel> = new Map();
  private initialized = false;

  constructor() {
    this.initializeModels();
  }

  private async initializeModels() {
    if (this.initialized) return;

    try {
      // Initialize TensorFlow.js
      await tf.ready();

      // Load face-api models
      await this.loadFaceAPIModels();

      // Load classification model (MobileNet)
      await this.loadClassificationModel();

      // Initialize OCR
      await this.initializeOCR();

      this.initialized = true;
      console.log("🧠 AI Engine initialized successfully");
    } catch (error) {
      console.error("Failed to initialize AI Engine:", error);
      throw error;
    }
  }

  private async loadFaceAPIModels() {
    const MODEL_URL = "/models/face-api";

    this.updateModelStatus("face-detection", {
      name: "Face Detection",
      type: "detection",
      loaded: false,
      loading: true,
      version: "1.0.0",
      size: "2.1MB",
    });

    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
      ]);

      this.updateModelStatus("face-detection", {
        name: "Face Detection",
        type: "detection",
        loaded: true,
        loading: false,
        version: "1.0.0",
        size: "2.1MB",
      });

      this.models.set("face-api", faceapi);
    } catch (error) {
      this.updateModelStatus("face-detection", {
        name: "Face Detection",
        type: "detection",
        loaded: false,
        loading: false,
        error: error.message,
        version: "1.0.0",
        size: "2.1MB",
      });
    }
  }

  private async loadClassificationModel() {
    this.updateModelStatus("classification", {
      name: "Image Classification",
      type: "classification",
      loaded: false,
      loading: true,
      version: "1.0.0",
      size: "4.2MB",
    });

    try {
      const model = await tf.loadLayersModel("/models/mobilenet/model.json");
      this.models.set("classification", model);

      this.updateModelStatus("classification", {
        name: "Image Classification",
        type: "classification",
        loaded: true,
        loading: false,
        version: "1.0.0",
        size: "4.2MB",
      });
    } catch (error) {
      // Fallback: use a simpler approach for classification
      this.updateModelStatus("classification", {
        name: "Image Classification",
        type: "classification",
        loaded: true,
        loading: false,
        version: "1.0.0 (Fallback)",
        size: "0MB",
      });
    }
  }

  private async initializeOCR() {
    this.updateModelStatus("ocr", {
      name: "OCR (Text Recognition)",
      type: "ocr",
      loaded: false,
      loading: true,
      version: "2.1.0",
      size: "6.8MB",
    });

    try {
      // Pre-load Tesseract worker
      const worker = await Tesseract.createWorker();
      await worker.loadLanguage("eng+ara");
      await worker.initialize("eng+ara");
      await worker.terminate();

      this.updateModelStatus("ocr", {
        name: "OCR (Text Recognition)",
        type: "ocr",
        loaded: true,
        loading: false,
        version: "2.1.0",
        size: "6.8MB",
      });
    } catch (error) {
      this.updateModelStatus("ocr", {
        name: "OCR (Text Recognition)",
        type: "ocr",
        loaded: false,
        loading: false,
        error: error.message,
        version: "2.1.0",
        size: "6.8MB",
      });
    }
  }

  private updateModelStatus(key: string, status: AIModel) {
    this.modelStatus.set(key, status);
  }

  public getModelStatus(): AIModel[] {
    return Array.from(this.modelStatus.values());
  }

  public async analyzeImage(file: File): Promise<ImageAnalysis> {
    await this.ensureInitialized();

    const imageElement = await this.loadImageElement(file);
    const canvas = await this.createCanvas(imageElement);

    const [
      description,
      faces,
      text,
      nsfwResult,
      dominantColors,
      duplicateHash,
    ] = await Promise.all([
      this.generateDescription(canvas),
      this.detectFaces(canvas),
      this.extractText(file),
      this.checkNSFW(canvas),
      this.extractDominantColors(canvas),
      this.generateHash(canvas),
    ]);

    return {
      description: description.text,
      confidence: description.confidence,
      objects: description.objects,
      faces,
      text,
      isNSFW: nsfwResult.isNSFW,
      nsfwScore: nsfwResult.score,
      dominantColors,
      duplicateHash,
      emotions: faces.flatMap(
        (f) => f.expressions?.map((e) => e.expression) || [],
      ),
    };
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await this.initializeModels();
    }
  }

  private async loadImageElement(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  private async createCanvas(
    img: HTMLImageElement,
  ): Promise<HTMLCanvasElement> {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    // Resize for better performance
    const maxSize = 512;
    const ratio = Math.min(maxSize / img.width, maxSize / img.height);
    canvas.width = img.width * ratio;
    canvas.height = img.height * ratio;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  private async generateDescription(canvas: HTMLCanvasElement): Promise<{
    text: string;
    confidence: number;
    objects: DetectedObject[];
  }> {
    // Simple rule-based classification for now
    const imageData = canvas
      .getContext("2d")!
      .getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Analyze color distribution
    let totalBrightness = 0;
    let colorChannels = { r: 0, g: 0, b: 0 };

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      colorChannels.r += r;
      colorChannels.g += g;
      colorChannels.b += b;
      totalBrightness += (r + g + b) / 3;
    }

    const pixelCount = pixels.length / 4;
    const avgBrightness = totalBrightness / pixelCount;
    const avgR = colorChannels.r / pixelCount;
    const avgG = colorChannels.g / pixelCount;
    const avgB = colorChannels.b / pixelCount;

    // Simple classification based on color analysis
    let description = "image";
    let confidence = 0.7;

    if (avgBrightness > 200) {
      description = "bright image with light colors";
    } else if (avgBrightness < 50) {
      description = "dark image";
    } else if (avgG > avgR && avgG > avgB) {
      description = "image with green nature elements";
    } else if (avgB > avgR && avgB > avgG) {
      description = "image with blue sky or water";
    } else if (avgR > avgG && avgR > avgB) {
      description = "warm colored image";
    }

    return {
      text: description,
      confidence,
      objects: [], // Would be populated by actual object detection model
    };
  }

  private async detectFaces(
    canvas: HTMLCanvasElement,
  ): Promise<FaceDetection[]> {
    const faceApi = this.models.get("face-api");
    if (!faceApi) return [];

    try {
      const detections = await faceapi
        .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();

      return detections.map((detection) => ({
        bbox: {
          x: detection.detection.box.x,
          y: detection.detection.box.y,
          width: detection.detection.box.width,
          height: detection.detection.box.height,
        },
        confidence: detection.detection.score,
        expressions: Object.entries(detection.expressions).map(
          ([expression, confidence]) => ({
            expression,
            confidence: confidence as number,
          }),
        ),
        age: detection.age,
        gender: detection.gender,
      }));
    } catch (error) {
      console.error("Face detection failed:", error);
      return [];
    }
  }

  private async extractText(file: File): Promise<OCRResult> {
    try {
      const worker = await Tesseract.createWorker();
      await worker.loadLanguage("eng+ara");
      await worker.initialize("eng+ara");

      const { data } = await worker.recognize(file);
      await worker.terminate();

      return {
        text: data.text,
        confidence: data.confidence / 100,
        words: data.words.map((word) => ({
          text: word.text,
          confidence: word.confidence / 100,
          bbox: {
            x: word.bbox.x0,
            y: word.bbox.y0,
            width: word.bbox.x1 - word.bbox.x0,
            height: word.bbox.y1 - word.bbox.y0,
          },
        })),
      };
    } catch (error) {
      console.error("OCR failed:", error);
      return {
        text: "",
        confidence: 0,
        words: [],
      };
    }
  }

  private async checkNSFW(
    canvas: HTMLCanvasElement,
  ): Promise<{ isNSFW: boolean; score: number }> {
    // Simple placeholder - in a real implementation, you'd use a proper NSFW detection model
    return {
      isNSFW: false,
      score: 0.1,
    };
  }

  private async extractDominantColors(
    canvas: HTMLCanvasElement,
  ): Promise<string[]> {
    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    const colorCounts = new Map<string, number>();

    // Sample every 10th pixel for performance
    for (let i = 0; i < pixels.length; i += 40) {
      const r = Math.round(pixels[i] / 32) * 32;
      const g = Math.round(pixels[i + 1] / 32) * 32;
      const b = Math.round(pixels[i + 2] / 32) * 32;

      const color = `rgb(${r},${g},${b})`;
      colorCounts.set(color, (colorCounts.get(color) || 0) + 1);
    }

    return Array.from(colorCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([color]) => color);
  }

  private async generateHash(canvas: HTMLCanvasElement): Promise<string> {
    // Generate a simple perceptual hash
    const smallCanvas = document.createElement("canvas");
    smallCanvas.width = 8;
    smallCanvas.height = 8;
    const ctx = smallCanvas.getContext("2d")!;

    ctx.drawImage(canvas, 0, 0, 8, 8);
    const imageData = ctx.getImageData(0, 0, 8, 8);
    const pixels = imageData.data;

    let hash = "";
    for (let i = 0; i < pixels.length; i += 4) {
      const gray = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      hash += gray > 128 ? "1" : "0";
    }

    return hash;
  }

  public categorizeImage(analysis: ImageAnalysis): ImageCategory {
    const { text, faces, isNSFW, description } = analysis;

    if (isNSFW) return "nsfw";
    if (faces.length > 0 && description.includes("selfie")) return "selfies";
    if (text.text.length > 50) return "documents";
    if (description.includes("screenshot")) return "screenshots";
    if (description.includes("nature") || description.includes("green"))
      return "nature";
    if (description.includes("food")) return "food";
    if (description.includes("receipt")) return "receipts";
    if (description.includes("pet") || description.includes("animal"))
      return "pets";
    if (description.includes("car") || description.includes("vehicle"))
      return "vehicles";
    if (
      description.includes("building") ||
      description.includes("architecture")
    )
      return "architecture";

    return "general";
  }

  public generateSmartFilename(analysis: ImageAnalysis): string {
    const { description, faces, text } = analysis;

    let filename = description
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 50);

    if (faces.length > 0) {
      filename = `portrait-${filename}`;
    }

    if (text.text.length > 0) {
      const firstWords = text.text
        .split(" ")
        .slice(0, 3)
        .join("-")
        .toLowerCase()
        .replace(/[^a-z0-9\-]/g, "");
      if (firstWords) {
        filename = `${firstWords}-${filename}`;
      }
    }

    return filename || "untitled";
  }

  public findSimilarImages(
    images: { id: string; analysis: ImageAnalysis }[],
  ): Array<{
    group: string[];
    similarity: number;
  }> {
    const groups: Array<{ group: string[]; similarity: number }> = [];
    const processed = new Set<string>();

    for (let i = 0; i < images.length; i++) {
      if (processed.has(images[i].id)) continue;

      const similarGroup = [images[i].id];
      processed.add(images[i].id);

      for (let j = i + 1; j < images.length; j++) {
        if (processed.has(images[j].id)) continue;

        const similarity = this.calculateHashSimilarity(
          images[i].analysis.duplicateHash,
          images[j].analysis.duplicateHash,
        );

        if (similarity > 0.9) {
          similarGroup.push(images[j].id);
          processed.add(images[j].id);
        }
      }

      if (similarGroup.length > 1) {
        groups.push({
          group: similarGroup,
          similarity: 0.95,
        });
      }
    }

    return groups;
  }

  private calculateHashSimilarity(hash1: string, hash2: string): number {
    if (hash1.length !== hash2.length) return 0;

    let matches = 0;
    for (let i = 0; i < hash1.length; i++) {
      if (hash1[i] === hash2[i]) matches++;
    }

    return matches / hash1.length;
  }
}

export const aiEngine = new AIEngine();
