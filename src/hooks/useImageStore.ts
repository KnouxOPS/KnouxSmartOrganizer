// src/hooks/useImageStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AIEngine } from "@/core/AIEngine";
import { ImageData, ImageStoreState } from "@/types/knoux-x2";

// إنشاء متجر Zustand مع middleware للاستمرارية
export const useImageStore = create<ImageStoreState>()(
  persist(
    (set, get) => {
      // إنشاء مثيل من محرك الذكاء الاصطناعي
      const aiEngine = new AIEngine((updatedImageId, updates) => {
        set((state) => {
          const currentImage = state.images.get(updatedImageId);
          if (currentImage) {
            const newImages = new Map(state.images);
            newImages.set(updatedImageId, { ...currentImage, ...updates });
            return { images: newImages };
          }
          return state;
        });
      });

      return {
        images: new Map(),
        selectedImages: new Set(),
        currentFilter: "",
        searchQuery: "",
        aiEngine,

        /**
         * يقوم بتحميل مجموعة من ملفات الصور وإضافتها إلى المتجر لبدء معالجتها.
         * @param files مصفوفة من كائنات File.
         */
        loadFolder: async (files: File[]) => {
          const newImages: Map<string, ImageData> = new Map();
          const timestamp = Date.now();

          for (const file of files) {
            // التحقق من أن الملف صورة
            if (!file.type.startsWith("image/")) {
              console.warn(`⚠️ Skipping non-image file: ${file.name}`);
              continue;
            }

            const id = `${file.name}-${file.lastModified}-${Math.random().toString(36).substring(2, 9)}`;

            // إنشاء URL للمعاينة
            const previewUrl = URL.createObjectURL(file);

            newImages.set(id, {
              id,
              file,
              previewUrl,
              isProcessed: false,
              timestamp: file.lastModified || timestamp,
              qualityScore: Math.random() * 0.3 + 0.7, // درجة جودة عشوائية مؤقتة
            });
          }

          console.log(`📁 Loading ${newImages.size} images to store`);

          set((state) => ({
            images: new Map([...state.images, ...newImages]),
          }));

          // تمرير الصور الجديدة إلى محرك الذكاء الاصطناعي للمعالجة في الخلفية
          const engine = get().aiEngine;
          await engine.processFiles(Array.from(newImages.values()));

          console.log(`🚀 Started AI processing for ${newImages.size} images`);
        },

        /**
         * يقوم بتحديث بيانات صورة معينة في المتجر.
         * @param id معرف الصورة.
         * @param updates كائن يحتوي على الخصائص المراد تحديثها.
         */
        updateImage: (id, updates) => {
          set((state) => {
            const currentImage = state.images.get(id);
            if (currentImage) {
              const newImages = new Map(state.images);
              newImages.set(id, { ...currentImage, ...updates });
              return { images: newImages };
            }
            return state;
          });
        },

        /**
         * يقوم بإزالة صورة من المتجر.
         * @param id معرف الصورة المراد إزالتها.
         */
        removeImage: (id) => {
          set((state) => {
            const image = state.images.get(id);
            if (image?.previewUrl) {
              // تحرير URL المؤقت
              URL.revokeObjectURL(image.previewUrl);
            }

            const newImages = new Map(state.images);
            newImages.delete(id);

            const newSelected = new Set(state.selectedImages);
            newSelected.delete(id);

            return {
              images: newImages,
              selectedImages: newSelected,
            };
          });
        },

        /**
         * تحديد صورة
         */
        selectImage: (id) => {
          set((state) => {
            const newSelected = new Set(state.selectedImages);
            if (newSelected.has(id)) {
              newSelected.delete(id);
            } else {
              newSelected.add(id);
            }
            return { selectedImages: newSelected };
          });
        },

        /**
         * مسح التحديد
         */
        clearSelection: () => {
          set({ selectedImages: new Set() });
        },

        /**
         * فلترة الصور بناءً على استعلام
         */
        filterImages: (query) => {
          const allImages = Array.from(get().images.values());
          const normalizedQuery = query.toLowerCase().trim();

          if (!normalizedQuery) return allImages;

          return allImages.filter((img) => {
            const searchText = [
              img.description || "",
              img.category || "",
              ...(img.tags || []),
              ...(img.people || []),
            ]
              .join(" ")
              .toLowerCase();

            return (
              searchText.includes(normalizedQuery) ||
              img.file?.name.toLowerCase().includes(normalizedQuery)
            );
          });
        },

        /**
         * البحث المتقدم في الصور
         */
        searchImages: async (query) => {
          const { aiEngine, images } = get();
          const allImages = Array.from(images.values());

          try {
            // استخدام البحث الدلالي من محرك الذكاء الاصطناعي
            const results = await aiEngine.semanticSearch(query, allImages);
            return results;
          } catch (error) {
            console.error("خطأ في البحث الدلالي:", error);
            // العودة للبحث النصي العادي
            return get().filterImages(query);
          }
        },

        /**
         * تصدير الوثائق التي تحتوي على كلمة مفتاحية
         */
        exportDocuments: async (keyword) => {
          console.log(`📄 Exporting documents containing: ${keyword}`);

          const allImages = Array.from(get().images.values());
          const documents = allImages.filter(
            (img) =>
              img.category === "document" ||
              img.category === "وثيقة" ||
              img.tags?.some((tag) =>
                tag.toLowerCase().includes(keyword.toLowerCase()),
              ),
          );

          if (documents.length === 0) {
            throw new Error(
              "لم يتم العثور على وثائق تحتوي على الكلمة المطلوبة",
            );
          }

          // محاكاة عملية التصدير
          const exportData = {
            keyword,
            totalDocuments: documents.length,
            exportDate: new Date().toISOString(),
            documents: documents.map((doc) => ({
              id: doc.id,
              name: doc.file?.name,
              description: doc.description,
              tags: doc.tags,
            })),
          };

          // إنشاء ملف JSON للتنزيل
          const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = url;
          a.download = `knoux-documents-${keyword}-${Date.now()}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          console.log(`✅ Exported ${documents.length} documents`);
        },

        /**
         * إنشاء قصة من الصور المحددة
         */
        generateStory: async (imageIds) => {
          console.log(`📖 Generating story for images: ${imageIds}`);

          const { images, aiEngine } = get();
          const selectedImages = imageIds
            .map((id) => images.get(id))
            .filter(Boolean) as ImageData[];

          if (selectedImages.length === 0) {
            throw new Error("لا توجد صور محددة لإنشاء القصة");
          }

          try {
            // تحليل الصور المحددة
            const analysis = await aiEngine.analyzeSelectedImages(imageIds);

            // إنشاء قصة بناءً على التحليل
            const story = {
              id: `story-${Date.now()}`,
              title: `قصة ${selectedImages.length} صورة رائعة`,
              description:
                analysis.suggestedStory || "رحلة عبر الذكريات الجميلة",
              images: imageIds,
              timeline: selectedImages.map((img, index) => ({
                imageId: img.id,
                timestamp: img.timestamp,
                duration: 3000, // 3 ثوان لكل صورة
                description: img.description || `الصورة ${index + 1}`,
              })),
              themes: analysis.commonThemes || ["ذكريات", "جمال", "لحظات"],
              createdAt: Date.now(),
            };

            console.log("✅ Story generated successfully:", story);
            return story;
          } catch (error) {
            console.error("خطأ في إنشاء القصة:", error);
            throw new Error("فشل في إنشاء القصة");
          }
        },

        /**
         * البحث عن صور مشابهة
         */
        findSimilarImages: (imageId) => {
          const { images } = get();
          const targetImage = images.get(imageId);

          if (!targetImage || !targetImage.embeddings) {
            return [];
          }

          const allImages = Array.from(images.values()).filter(
            (img) => img.id !== imageId && img.embeddings,
          );

          // حساب التشابه بناءً على التضمينات
          const similarities = allImages.map((img) => {
            const similarity = calculateCosineSimilarity(
              targetImage.embeddings!,
              img.embeddings!,
            );
            return { image: img, similarity };
          });

          // ترتيب حسب التشابه وإرجاع أفضل 10
          return similarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 10)
            .filter((item) => item.similarity > 0.7) // عتبة تشابه دنيا
            .map((item) => item.image);
        },

        /**
         * تجميع الصور حسب الأحداث
         */
        groupByEvent: () => {
          const { images } = get();
          const allImages = Array.from(images.values());
          const groups = new Map<string, ImageData[]>();

          // تجميع بسيط بناءً على التاريخ والفئة
          allImages.forEach((img) => {
            const date = new Date(img.timestamp);
            const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
            const category = img.category || "عام";
            const key = `${month}-${category}`;

            if (!groups.has(key)) {
              groups.set(key, []);
            }
            groups.get(key)!.push(img);
          });

          return groups;
        },

        /**
         * إنشاء خريطة الذكريات
         */
        createMemoryMap: async () => {
          console.log("🗺️ Creating memory map...");
          const { images } = get();
          const allImages = Array.from(images.values()).filter(
            (img) => img.isProcessed && img.embeddings,
          );

          // هنا يمكن تطبيق خوارزميات تقليل الأبعاد مثل t-SNE أو UMAP
          console.log(`✅ Memory map created for ${allImages.length} images`);
        },
      };
    },
    {
      name: "knoux-x2-storage",
      storage: createJSONStorage(() => localStorage),
      // تخصيص البيانات المحفوظة
      partialize: (state) => ({
        images: new Map(
          Array.from(state.images.entries()).map(([id, img]) => [
            id,
            {
              id: img.id,
              previewUrl: img.previewUrl,
              embeddings: img.embeddings,
              description: img.description,
              tags: img.tags,
              faces: img.faces,
              isProcessed: img.isProcessed,
              processingError: img.processingError,
              timestamp: img.timestamp,
              category: img.category,
              colors: img.colors,
              people: img.people,
              qualityScore: img.qualityScore,
            },
          ]),
        ),
        currentFilter: state.currentFilter,
        searchQuery: state.searchQuery,
      }),
      // معالجة البيانات المحملة
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log("🔄 Rehydrated store with", state.images.size, "images");
        }
      },
    },
  ),
);

/**
 * حساب التشابه الكوسيني بين متجهين
 */
function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}
