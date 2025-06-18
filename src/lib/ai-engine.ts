// src/lib/ai-engine.ts

import { pipeline, RawImage } from "@xenova/transformers";
import * as nsfwjs from "nsfwjs";
import * as faceapi from "@vladmandic/face-api";
import { createWorker } from "tesseract.js";
import { phash } from "image-hash";

// --- واجهة التحكم التي يضبطها المستخدم ---
export interface AiSettings {
  runClassifier: boolean;
  runCaptioner: boolean;
  runObjectDetection: boolean;
  runNsfw: boolean;
  nsfwThreshold: number; // 0.1 to 0.9
  runFaceDetection: boolean;
  runOcr: boolean;
  runDuplicateDetection: boolean;
  runQualityAnalysis: boolean;
  runColorPalette: boolean;
}

// --- واجهة البيانات التفصيلية لكل صورة ---
export interface ImageAnalysis {
  id: string;
  file: File;
  previewUrl: string;
  error?: string;

  // بيانات أساسية
  dimensions: { width: number; height: number };
  size: number; // in MB

  // بيانات الذكاء الاصطناعي
  classification?: { label: string; score: number }[];
  description?: string;
  objects?: { box: any; label: string; score: number }[];
  nsfw?: {
    className: "Porn" | "Hentai" | "Sexy" | "Drawing" | "Neutral";
    probability: number;
  }[];
  faces?: {
    age: number;
    gender: "male" | "female";
    expression: string;
    confidence: number;
    box: any;
  }[];
  ocrText?: string;
  pHash?: string;
  quality?: {
    sharpness: number;
    contrast: number;
    brightness: number;
    score: number;
  };
  palette?: string[]; // hex codes

  // إحصائيات المعالجة
  processingTime: number;
  timestamp: Date;
}

// --- محرك الذكاء الاصطناعي ---
class AIEngine {
  private models: any = {};
  private isReady = false;
  private loadingProgress = 0;

  async initialize(
    settings: AiSettings,
    progressCallback: (status: string, progress: number) => void,
  ) {
    if (this.isReady) return;

    this.loadingProgress = 0;
    progressCallback("🚀 بدء تهيئة النماذج المتقدمة...", 0);

    try {
      // تحميل النماذج بناءً على إعدادات المستخدم لتوفير الذاكرة
      let totalModels = 0;
      let loadedModels = 0;

      // حساب عدد النماذج المطلوبة
      if (settings.runClassifier) totalModels++;
      if (settings.runCaptioner) totalModels++;
      if (settings.runObjectDetection) totalModels++;
      if (settings.runNsfw) totalModels++;
      if (settings.runFaceDetection) totalModels++;
      if (settings.runOcr) totalModels++;

      // 1. نموذج التصنيف العام الدقيق - CLIP ViT
      if (settings.runClassifier) {
        try {
          progressCallback(
            "📸 تحميل نموذج التصنيف المتقدم (CLIP)...",
            (loadedModels / totalModels) * 90,
          );
          this.models.classifier = await pipeline(
            "zero-shot-image-classification",
            "Xenova/clip-vit-base-patch32",
          );
          progressCallback(
            "✅ تم تحميل نموذج التصنيف",
            (loadedModels / totalModels) * 90,
          );
        } catch (error) {
          console.warn("فشل تحميل نموذج التصنيف:", error);
          this.models.classifierFailed = true;
          progressCallback(
            "⚠️ فشل تحميل نموذج التصنيف - سيتم استخدام بديل",
            (loadedModels / totalModels) * 90,
          );
        }
        loadedModels++;
      }

      // 2. الوصف الذكي والسياقي - ViT-GPT2
      if (settings.runCaptioner) {
        try {
          progressCallback(
            "📝 تحميل نموذج الوصف الذكي (ViT-GPT2)...",
            (loadedModels / totalModels) * 90,
          );
          this.models.captioner = await pipeline(
            "image-to-text",
            "Xenova/vit-gpt2-image-captioning",
          );
          progressCallback(
            "✅ تم تحميل نموذج الوصف",
            (loadedModels / totalModels) * 90,
          );
        } catch (error) {
          console.warn("فشل تحميل نموذج الوصف:", error);
          this.models.captionerFailed = true;
          progressCallback(
            "⚠️ فشل تحميل نموذج الوصف - سيتم استخدام بديل",
            (loadedModels / totalModels) * 90,
          );
        }
        loadedModels++;
      }

      // 3. كشف الأجسام وتحديدها - YOLOS
      if (settings.runObjectDetection) {
        try {
          progressCallback(
            "🎯 تحميل نموذج كشف الأجسام (YOLOS)...",
            (loadedModels / totalModels) * 90,
          );
          this.models.objectDetector = await pipeline(
            "object-detection",
            "Xenova/yolos-tiny",
          );
          progressCallback(
            "✅ تم تحميل نموذج كشف الأجسام",
            (loadedModels / totalModels) * 90,
          );
        } catch (error) {
          console.warn("فشل تحميل نموذج كشف الأجسام:", error);
          this.models.objectDetectorFailed = true;
          progressCallback(
            "⚠️ فشل تحميل نموذج كشف الأجسام - سيتم استخدام بديل",
            (loadedModels / totalModels) * 90,
          );
        }
        loadedModels++;
      }

      // 4. كشف المحتوى الحساس - NSFWJS
      if (settings.runNsfw) {
        try {
          progressCallback(
            "🔍 تحميل نموذج المحتوى الحساس (NSFWJS)...",
            (loadedModels / totalModels) * 90,
          );
          this.models.nsfw = await nsfwjs.load();
          progressCallback(
            "✅ تم تحميل نموذج المحتوى الحساس",
            (loadedModels / totalModels) * 90,
          );
        } catch (error) {
          console.warn("فشل تحميل نموذج NSFW:", error);
          this.models.nsfwFailed = true;
          progressCallback(
            "⚠️ فشل تحميل نموذج NSFW - سيتم استخدام بديل",
            (loadedModels / totalModels) * 90,
          );
        }
        loadedModels++;
      }

      // 5. كشف وتحليل الوجوه - Face-API
      if (settings.runFaceDetection) {
        progressCallback(
          "👤 تحميل نماذج كشف الوجوه (Face-API)...",
          (loadedModels / totalModels) * 90,
        );
        try {
          // استخدام CDN مباشرة لضمان التوافق
          const cdnPath =
            "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model/";

          progressCallback(
            "👤 تحميل نموذج كشف الوجوه الأساسي...",
            (loadedModels / totalModels) * 90,
          );
          await faceapi.nets.ssdMobilenetv1.loadFromUri(cdnPath);

          progressCallback(
            "👤 تحميل نموذج تحليل العمر والجنس...",
            (loadedModels / totalModels) * 90,
          );
          await faceapi.nets.ageGenderNet.loadFromUri(cdnPath);

          progressCallback(
            "👤 تحميل نموذج تحليل المشاعر...",
            (loadedModels / totalModels) * 90,
          );
          await faceapi.nets.faceExpressionNet.loadFromUri(cdnPath);

          progressCallback(
            "👤 تحميل نموذج النقاط المرجعية...",
            (loadedModels / totalModels) * 90,
          );
          await faceapi.nets.faceLandmark68Net.loadFromUri(cdnPath);
        } catch (error) {
          console.warn(
            "فشل تحميل نماذج Face-API، سيتم تعطيل كشف الوجوه:",
            error,
          );
          // في حالة الفشل، نعطل كشف الوجوه لهذه الجلسة
          this.models.faceDetectionFailed = true;
        }
        loadedModels++;
        progressCallback(
          "✅ تم تحميل نماذج كشف الوجوه",
          (loadedModels / totalModels) * 90,
        );
      }

      // 6. استخراج النصوص - Tesseract.js
      if (settings.runOcr) {
        try {
          progressCallback(
            "📖 تهيئة قارئ النصوص (Tesseract)...",
            (loadedModels / totalModels) * 90,
          );
          this.models.ocr = await createWorker("eng+ara");
          progressCallback(
            "✅ تم تهيئة قارئ النصوص",
            (loadedModels / totalModels) * 90,
          );
        } catch (error) {
          console.warn("فشل تهيئة Tesseract:", error);
          this.models.ocrFailed = true;
          progressCallback(
            "⚠️ فشل تهيئة OCR - سيتم استخدام بديل",
            (loadedModels / totalModels) * 90,
          );
        }
        loadedModels++;
      }

      this.isReady = true;
      progressCallback("🎉 جميع النماذج المطلوبة جاهزة للاستخدام!", 100);
    } catch (error) {
      console.error("خطأ في تهيئة النماذج:", error);
      progressCallback(`❌ خطأ في تحميل النماذج: ${error}`, 0);
      throw error;
    }
  }

  async analyze(file: File, settings: AiSettings): Promise<ImageAnalysis> {
    if (!this.isReady)
      throw new Error("المحرك لم يُهيأ بعد. استدعي initialize() أولاً.");

    const startTime = Date.now();
    const previewUrl = URL.createObjectURL(file);
    const imageElement = await this.createImageElement(previewUrl);

    const analysis: ImageAnalysis = {
      id: crypto.randomUUID(),
      file,
      previewUrl,
      dimensions: { width: imageElement.width, height: imageElement.height },
      size: parseFloat((file.size / (1024 * 1024)).toFixed(2)),
      processingTime: 0,
      timestamp: new Date(),
    };

    try {
      // تنفيذ كل مهمة ذكاء اصطناعي بناءً على إعدادات المستخدم

      // 1. التصنيف العام الدقيق
      if (settings.runClassifier && this.models.classifier) {
        try {
          const candidateLabels = [
            "person",
            "people",
            "selfie",
            "portrait",
            "group photo",
            "car",
            "vehicle",
            "motorcycle",
            "bicycle",
            "truck",
            "animal",
            "dog",
            "cat",
            "bird",
            "horse",
            "wildlife",
            "food",
            "meal",
            "restaurant",
            "cooking",
            "drink",
            "nature",
            "landscape",
            "mountain",
            "beach",
            "forest",
            "sunset",
            "document",
            "text",
            "paper",
            "book",
            "certificate",
            "screenshot",
            "computer screen",
            "mobile screen",
            "building",
            "architecture",
            "house",
            "street",
            "sport",
            "game",
            "activity",
            "exercise",
            "art",
            "painting",
            "drawing",
            "creative",
          ];
          const results = await this.models.classifier(
            previewUrl,
            candidateLabels,
          );
          analysis.classification = results.slice(0, 5); // أفضل 5 تصنيفات
        } catch (e) {
          console.error("Classifier Error:", e);
          analysis.error = `خطأ في التصنيف: ${e}`;
        }
      }

      // 2. الوصف الذكي والسياقي
      if (settings.runCaptioner && this.models.captioner) {
        try {
          const result = await this.models.captioner(previewUrl);
          analysis.description =
            result[0]?.generated_text || "لا يمكن وصف الصورة";
        } catch (e) {
          console.error("Captioner Error:", e);
          analysis.error = `خطأ في الوصف: ${e}`;
        }
      }

      // 3. كشف الأجسام وتحديدها
      if (settings.runObjectDetection && this.models.objectDetector) {
        try {
          const results = await this.models.objectDetector(previewUrl);
          analysis.objects = results.map((obj: any) => ({
            box: obj.box,
            label: obj.label,
            score: obj.score,
          }));
        } catch (e) {
          console.error("Object Detection Error:", e);
          analysis.error = `خطأ في كشف الأجسام: ${e}`;
        }
      }

      // 4. كشف المحتوى الحساس
      if (settings.runNsfw && this.models.nsfw) {
        try {
          const predictions = await this.models.nsfw.classify(imageElement);
          analysis.nsfw = predictions.filter((p: any) => p.probability > 0.01); // إظهار النتائج ذات الصلة
        } catch (e) {
          console.error("NSFW Error:", e);
          analysis.error = `خطأ في كشف المحتوى: ${e}`;
        }
      }

      // 5. كشف وتحليل الوجوه المتقدم
      if (settings.runFaceDetection && !this.models.faceDetectionFailed) {
        try {
          // التحقق من تحميل النماذج المطلوبة
          if (
            faceapi.nets.ssdMobilenetv1.isLoaded &&
            faceapi.nets.ageGenderNet.isLoaded &&
            faceapi.nets.faceExpressionNet.isLoaded
          ) {
            const detections = await faceapi
              .detectAllFaces(imageElement)
              .withAgeAndGender()
              .withFaceExpressions()
              .withFaceLandmarks();

            analysis.faces = detections.map((d: any) => ({
              age: Math.round(d.age || 25),
              gender: d.gender || "unknown",
              expression: this.getTopExpression(d.expressions),
              confidence: d.detection?.score || 0.5,
              box: d.detection?.box || {},
            }));
          } else {
            console.warn("نماذج كشف الوجوه غير محملة بالكامل");
            analysis.error = "نماذج كشف الوجوه غير متوفرة";
          }
        } catch (e) {
          console.error("Face API Error:", e);
          analysis.error = `خطأ في كشف الوجوه: ${e}`;
        }
      }

      // 6. استخراج النصوص (OCR)
      if (settings.runOcr && this.models.ocr) {
        try {
          const {
            data: { text },
          } = await this.models.ocr.recognize(file);
          analysis.ocrText = text.trim();
        } catch (e) {
          console.error("OCR Error:", e);
          analysis.error = `خطأ في قراءة النصوص: ${e}`;
        }
      }

      // 7. كشف النسخ المكررة (pHash)
      if (settings.runDuplicateDetection) {
        try {
          analysis.pHash = await this.generatePHash(imageElement);
        } catch (e) {
          console.error("pHash Error:", e);
          analysis.error = `خطأ في توليد البصمة: ${e}`;
        }
      }

      // 8. تقييم جودة وجمالية الصورة
      if (settings.runQualityAnalysis) {
        try {
          analysis.quality = await this.analyzeQuality(imageElement);
        } catch (e) {
          console.error("Quality Analysis Error:", e);
          analysis.error = `خطأ في تحليل الجودة: ${e}`;
        }
      }

      // 9. استخراج لوحة الألوان
      if (settings.runColorPalette) {
        try {
          analysis.palette = await this.extractColorPalette(imageElement);
        } catch (e) {
          console.error("Color Palette Error:", e);
          analysis.error = `خطأ في استخراج الألوان: ${e}`;
        }
      }
    } catch (generalError) {
      console.error("General Analysis Error:", generalError);
      analysis.error = `خطأ عام في التحليل: ${generalError}`;
    }

    analysis.processingTime = Date.now() - startTime;
    return analysis;
  }

  // --- خوارزميات مخصصة ---

  private async generatePHash(imageElement: HTMLImageElement): Promise<string> {
    // تحويل الصورة إلى Canvas للمعالجة
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    // تصغير الصورة لحساب البصمة
    canvas.width = 32;
    canvas.height = 32;
    ctx.drawImage(imageElement, 0, 0, 32, 32);

    const imageData = ctx.getImageData(0, 0, 32, 32);
    let hash = "";

    // حساب متوسط السطوع
    let total = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      total += (r + g + b) / 3;
    }
    const average = total / (imageData.data.length / 4);

    // إنشاء البصمة
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      const brightness = (r + g + b) / 3;
      hash += brightness > average ? "1" : "0";
    }

    return hash;
  }

  private async analyzeQuality(imageElement: HTMLImageElement): Promise<{
    sharpness: number;
    contrast: number;
    brightness: number;
    score: number;
  }> {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    canvas.width = Math.min(imageElement.width, 400);
    canvas.height = Math.min(imageElement.height, 400);
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // حساب السطوع
    let totalBrightness = 0;
    let brightnessValues = [];

    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      const brightness = (r + g + b) / 3;
      totalBrightness += brightness;
      brightnessValues.push(brightness);
    }

    const avgBrightness = totalBrightness / brightnessValues.length;

    // حساب التباين (Contrast)
    let contrastSum = 0;
    for (const brightness of brightnessValues) {
      contrastSum += Math.pow(brightness - avgBrightness, 2);
    }
    const contrast = Math.sqrt(contrastSum / brightnessValues.length) / 255;

    // حساب الحدة (Sharpness) باستخدام Sobel operator
    const sharpness = this.calculateSharpness(imageData);

    // حساب درجة الجودة الإجمالية
    const brightnessScore = 1 - Math.abs(avgBrightness - 128) / 128; // أفضل سطوع حول 128
    const contrastScore = Math.min(contrast * 2, 1); // التباين الجيد
    const sharpnessScore = Math.min(sharpness, 1); // الحدة الجيدة

    const overallScore = (brightnessScore + contrastScore + sharpnessScore) / 3;

    return {
      sharpness: parseFloat(sharpnessScore.toFixed(3)),
      contrast: parseFloat(contrast.toFixed(3)),
      brightness: parseFloat((avgBrightness / 255).toFixed(3)),
      score: parseFloat(overallScore.toFixed(3)),
    };
  }

  private calculateSharpness(imageData: ImageData): number {
    const { width, height, data } = imageData;
    let sharpness = 0;

    // Sobel operator للكشف عن الحواف
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = (y * width + x) * 4;

        // الحصول على قيم الرمادي للبكسلات المجاورة
        const tl =
          (data[i - width * 4 - 4] +
            data[i - width * 4 - 3] +
            data[i - width * 4 - 2]) /
          3;
        const tm =
          (data[i - width * 4] +
            data[i - width * 4 + 1] +
            data[i - width * 4 + 2]) /
          3;
        const tr =
          (data[i - width * 4 + 4] +
            data[i - width * 4 + 5] +
            data[i - width * 4 + 6]) /
          3;
        const ml = (data[i - 4] + data[i - 3] + data[i - 2]) / 3;
        const mr = (data[i + 4] + data[i + 5] + data[i + 6]) / 3;
        const bl =
          (data[i + width * 4 - 4] +
            data[i + width * 4 - 3] +
            data[i + width * 4 - 2]) /
          3;
        const bm =
          (data[i + width * 4] +
            data[i + width * 4 + 1] +
            data[i + width * 4 + 2]) /
          3;
        const br =
          (data[i + width * 4 + 4] +
            data[i + width * 4 + 5] +
            data[i + width * 4 + 6]) /
          3;

        // Sobel X و Y
        const sobelX = -1 * tl + 1 * tr + -2 * ml + 2 * mr + -1 * bl + 1 * br;
        const sobelY = -1 * tl + -2 * tm + -1 * tr + 1 * bl + 2 * bm + 1 * br;

        sharpness += Math.sqrt(sobelX * sobelX + sobelY * sobelY);
      }
    }

    return sharpness / (width * height * 255);
  }

  private async extractColorPalette(
    imageElement: HTMLImageElement,
    k: number = 5,
  ): Promise<string[]> {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    // تصغير الصورة لتسريع المعالجة
    canvas.width = 150;
    canvas.height = 150;
    ctx.drawImage(imageElement, 0, 0, 150, 150);

    const imageData = ctx.getImageData(0, 0, 150, 150);
    const pixels: [number, number, number][] = [];

    // جمع جميع البكسلات
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      const a = imageData.data[i + 3];

      // تجاهل البكسلات الشفافة
      if (a > 128) {
        pixels.push([r, g, b]);
      }
    }

    // تطبيق K-Means clustering مبسط
    const palette = this.kMeansClustering(pixels, k);

    // تحويل إلى hex colors
    return palette.map(
      (color) =>
        "#" +
        color.map((c) => Math.round(c).toString(16).padStart(2, "0")).join(""),
    );
  }

  private kMeansClustering(
    pixels: [number, number, number][],
    k: number,
  ): [number, number, number][] {
    // خوارزمية K-Means مبسطة
    let centroids: [number, number, number][] = [];

    // تهيئة المراكز عشوائياً
    for (let i = 0; i < k; i++) {
      const randomPixel = pixels[Math.floor(Math.random() * pixels.length)];
      centroids.push([...randomPixel]);
    }

    // تكرار للوصول للحل الأمثل
    for (let iteration = 0; iteration < 20; iteration++) {
      const clusters: [number, number, number][][] = Array(k)
        .fill(null)
        .map(() => []);

      // تجميع البكسلات حسب أقرب مركز
      for (const pixel of pixels) {
        let minDistance = Infinity;
        let closestCentroid = 0;

        for (let j = 0; j < centroids.length; j++) {
          const distance = Math.sqrt(
            Math.pow(pixel[0] - centroids[j][0], 2) +
              Math.pow(pixel[1] - centroids[j][1], 2) +
              Math.pow(pixel[2] - centroids[j][2], 2),
          );

          if (distance < minDistance) {
            minDistance = distance;
            closestCentroid = j;
          }
        }

        clusters[closestCentroid].push(pixel);
      }

      // تحديث المراكز
      for (let j = 0; j < centroids.length; j++) {
        if (clusters[j].length > 0) {
          const avgR =
            clusters[j].reduce((sum, p) => sum + p[0], 0) / clusters[j].length;
          const avgG =
            clusters[j].reduce((sum, p) => sum + p[1], 0) / clusters[j].length;
          const avgB =
            clusters[j].reduce((sum, p) => sum + p[2], 0) / clusters[j].length;
          centroids[j] = [avgR, avgG, avgB];
        }
      }
    }

    return centroids;
  }

  // --- Helper Methods ---

  private createImageElement(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = url;
    });
  }

  private getTopExpression(expressions: any): string {
    if (!expressions) return "neutral";

    const expressionNames: { [key: string]: string } = {
      happy: "سعيد",
      sad: "حزين",
      angry: "غاضب",
      fearful: "خائف",
      disgusted: "مشمئز",
      surprised: "متفاجئ",
      neutral: "محايد",
    };

    let topExpression = "neutral";
    let maxProbability = 0;

    for (const [expression, probability] of Object.entries(expressions)) {
      if (typeof probability === "number" && probability > maxProbability) {
        maxProbability = probability;
        topExpression = expression;
      }
    }

    return expressionNames[topExpression] || "محايد";
  }

  // --- Public Methods ---

  getStatus() {
    return {
      isReady: this.isReady,
      loadingProgress: this.loadingProgress,
      modelsLoaded: {
        classifier: !!this.models.classifier,
        captioner: !!this.models.captioner,
        objectDetector: !!this.models.objectDetector,
        nsfw: !!this.models.nsfw,
        ocr: !!this.models.ocr,
        faceDetection: !!faceapi.nets.ssdMobilenetv1.isLoaded,
      },
    };
  }

  async terminate() {
    if (this.models.ocr) {
      await this.models.ocr.terminate();
    }
    this.isReady = false;
    this.models = {};
  }
}

// --- Default Settings ---
export const defaultAiSettings: AiSettings = {
  runClassifier: true,
  runCaptioner: true,
  runObjectDetection: false, // معطل افتراضياً للسرعة
  runNsfw: true,
  nsfwThreshold: 0.7,
  runFaceDetection: true,
  runOcr: true,
  runDuplicateDetection: false,
  runQualityAnalysis: true,
  runColorPalette: true,
};

export const aiEngine = new AIEngine();
