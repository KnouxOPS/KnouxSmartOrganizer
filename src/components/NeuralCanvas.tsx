// src/components/NeuralCanvas.tsx
import React, { useMemo, useRef, useEffect, useState } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { useImageStore } from "@/hooks/useImageStore";
import { ImageData, PositionedImage } from "@/types/knoux-x2";
import { scaleLinear } from "d3-scale";

/**
 * وظيفة لتحويل التضمينات عالية الأبعاد إلى إحداثيات ثنائية الأبعاد (X, Y).
 * في تطبيق حقيقي، ستُستخدم خوارزمية لتقليل الأبعاد مثل UMAP أو t-SNE.
 * @param imagesMap خريطة الصور من المتجر.
 * @returns مصفوفة من PositionedImage مع إحداثيات X,Y.
 */
const mapEmbeddingsToPositions = (
  imagesMap: Map<string, ImageData>,
): PositionedImage[] => {
  // تصفية الصور التي تحتوي على تض��ينات صالحة
  const allImages = Array.from(imagesMap.values()).filter(
    (img) => img.embeddings && img.embeddings.length >= 2,
  );

  if (allImages.length === 0) return [];

  // إذا كانت هناك صورة واحدة فقط، ضعها في المركز
  if (allImages.length === 1) {
    return [
      {
        id: allImages[0].id,
        previewUrl: allImages[0].previewUrl,
        x: 0,
        y: 0,
        cluster: "single",
      },
    ];
  }

  // استخراج أول بُعدين للتضمين لإنشاء إحداثيات X, Y
  const xValues = allImages.map((img) => img.embeddings![0]);
  const yValues = allImages.map((img) => img.embeddings![1]);

  const xDomain = [Math.min(...xValues), Math.max(...xValues)];
  const yDomain = [Math.min(...yValues), Math.max(...yValues)];

  // تحديد نطاق الإحداثيات
  const canvasSize = 3000; // حجم اللوحة الافتراضي
  const xScale = scaleLinear()
    .domain(xDomain)
    .range([-canvasSize / 2, canvasSize / 2]);
  const yScale = scaleLinear()
    .domain(yDomain)
    .range([-canvasSize / 2, canvasSize / 2]);

  // تجميع الصور في مجموعات بناءً على التشابه
  const clusters = createClusters(allImages);

  return allImages.map((img) => {
    const baseX = xScale(img.embeddings![0]);
    const baseY = yScale(img.embeddings![1]);

    // إضافة تشويش طفيف لتجنب التداخل التام
    const noise = 50;
    const x = baseX + (Math.random() - 0.5) * noise;
    const y = baseY + (Math.random() - 0.5) * noise;

    return {
      id: img.id,
      previewUrl: img.previewUrl,
      x,
      y,
      cluster: findClusterForImage(img, clusters),
      similarity: calculateImageSimilarity(img, allImages),
    };
  });
};

/**
 * إنشاء مجموعات من الصور بناءً على الفئة والوقت
 */
const createClusters = (images: ImageData[]): Map<string, ImageData[]> => {
  const clusters = new Map<string, ImageData[]>();

  images.forEach((img) => {
    const date = new Date(img.timestamp);
    const category = img.category || "عام";
    const timeSlot = `${date.getFullYear()}-${Math.floor(date.getMonth() / 3)}`;
    const clusterKey = `${category}-${timeSlot}`;

    if (!clusters.has(clusterKey)) {
      clusters.set(clusterKey, []);
    }
    clusters.get(clusterKey)!.push(img);
  });

  return clusters;
};

/**
 * العثور على المجموعة التي تنتمي إليها الصورة
 */
const findClusterForImage = (
  image: ImageData,
  clusters: Map<string, ImageData[]>,
): string => {
  for (const [clusterName, clusterImages] of clusters.entries()) {
    if (clusterImages.some((img) => img.id === image.id)) {
      return clusterName;
    }
  }
  return "default";
};

/**
 * حساب درجة التشابه للصورة مع باقي الصور
 */
const calculateImageSimilarity = (
  image: ImageData,
  allImages: ImageData[],
): number => {
  if (!image.embeddings) return 0;

  const similarities = allImages
    .filter((img) => img.id !== image.id && img.embeddings)
    .map((img) => {
      const dotProduct = image
        .embeddings!.slice(0, 10)
        .reduce((sum, val, i) => sum + val * img.embeddings![i], 0);
      return Math.abs(dotProduct);
    });

  return similarities.length > 0
    ? similarities.reduce((sum, sim) => sum + sim, 0) / similarities.length
    : 0;
};

export function NeuralCanvas() {
  const { images, selectedImages, selectImage } = useImageStore();
  const [viewMode, setViewMode] = useState<"overview" | "cluster" | "timeline">(
    "overview",
  );
  const [showConnections, setShowConnections] = useState(false);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  // حساب مواضع الصور
  const imagePositions = useMemo(
    () => mapEmbeddingsToPositions(images),
    [images],
  );

  // تحكم في الحركة
  const controls = useAnimation();
  const canvasRef = useRef<HTMLDivElement>(null);

  // إعدادات العرض
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // إعادة تعيين العرض عند تغيير الصور
  useEffect(() => {
    if (imagePositions.length > 0) {
      // حساب المركز التلقائي
      const avgX =
        imagePositions.reduce((sum, img) => sum + img.x, 0) /
        imagePositions.length;
      const avgY =
        imagePositions.reduce((sum, img) => sum + img.y, 0) /
        imagePositions.length;

      controls.start(
        {
          x: -avgX + window.innerWidth / 2,
          y: -avgY + window.innerHeight / 2,
          scale: 0.8,
        },
        { duration: 1.5, ease: "easeOut" },
      );
    }
  }, [imagePositions.length, controls]);

  // التعامل مع التكبير/التصغير
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const { deltaY } = event;

    const newZoom = Math.max(0.1, Math.min(3, zoom + deltaY * -0.001));
    setZoom(newZoom);

    controls.start({ scale: newZoom }, { duration: 0.1 });
  };

  // التعامل مع السحب
  const handleDrag = (event: any, info: PanInfo) => {
    setPan({
      x: pan.x + info.delta.x,
      y: pan.y + info.delta.y,
    });
  };

  // الانتقال إلى صورة محددة
  const focusOnImage = (imageId: string) => {
    const image = imagePositions.find((img) => img.id === imageId);
    if (image) {
      controls.start(
        {
          x: -image.x + window.innerWidth / 2,
          y: -image.y + window.innerHeight / 2,
          scale: 1.5,
        },
        { duration: 1, ease: "easeOut" },
      );
    }
  };

  // تجميع الصور حسب المجموعات
  const clusteredImages = useMemo(() => {
    const clusters = new Map<string, PositionedImage[]>();
    imagePositions.forEach((img) => {
      const cluster = img.cluster || "default";
      if (!clusters.has(cluster)) {
        clusters.set(cluster, []);
      }
      clusters.get(cluster)!.push(img);
    });
    return clusters;
  }, [imagePositions]);

  // ألوان المجموعات
  const clusterColors = [
    "rgba(59, 130, 246, 0.6)", // أزرق
    "rgba(16, 185, 129, 0.6)", // أخضر
    "rgba(245, 101, 101, 0.6)", // أحمر
    "rgba(139, 92, 246, 0.6)", // بنفسجي
    "rgba(245, 158, 11, 0.6)", // برتقالي
    "rgba(236, 72, 153, 0.6)", // وردي
  ];

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 overflow-hidden">
      {/* شريط التحكم العلوي */}
      <div className="absolute top-4 left-4 z-20 flex space-x-2">
        <motion.button
          className={`px-4 py-2 rounded-lg backdrop-blur-lg transition-all ${
            viewMode === "overview"
              ? "bg-blue-500 text-white"
              : "bg-white/10 text-white/70"
          }`}
          onClick={() => setViewMode("overview")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          نظرة عامة
        </motion.button>

        <motion.button
          className={`px-4 py-2 rounded-lg backdrop-blur-lg transition-all ${
            viewMode === "cluster"
              ? "bg-blue-500 text-white"
              : "bg-white/10 text-white/70"
          }`}
          onClick={() => setViewMode("cluster")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          مجموعات
        </motion.button>

        <motion.button
          className={`px-4 py-2 rounded-lg backdrop-blur-lg transition-all ${
            showConnections
              ? "bg-green-500 text-white"
              : "bg-white/10 text-white/70"
          }`}
          onClick={() => setShowConnections(!showConnections)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          الروابط
        </motion.button>
      </div>

      {/* معلومات الحالة */}
      <div className="absolute top-4 right-4 z-20 bg-black/30 backdrop-blur-lg rounded-lg p-3 text-white text-sm">
        <div>الصور: {imagePositions.length}</div>
        <div>المجموعات: {clusteredImages.size}</div>
        <div>التكبير: {(zoom * 100).toFixed(0)}%</div>
      </div>

      {/* اللوحة الرئيسية */}
      <div
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
      >
        <motion.div
          className="absolute inset-0"
          drag
          dragConstraints={{
            left: -5000,
            right: 5000,
            top: -5000,
            bottom: 5000,
          }}
          onDrag={handleDrag}
          animate={controls}
          initial={{ scale: 1, x: 0, y: 0 }}
        >
          {/* رسم خلفية المجموعات */}
          {viewMode === "cluster" &&
            Array.from(clusteredImages.entries()).map(
              ([clusterName, clusterImages], clusterIndex) => {
                if (clusterImages.length < 2) return null;

                // حساب الحدود الخارجية للمجموعة
                const minX =
                  Math.min(...clusterImages.map((img) => img.x)) - 100;
                const maxX =
                  Math.max(...clusterImages.map((img) => img.x)) + 100;
                const minY =
                  Math.min(...clusterImages.map((img) => img.y)) - 100;
                const maxY =
                  Math.max(...clusterImages.map((img) => img.y)) + 100;

                return (
                  <motion.div
                    key={`cluster-${clusterName}`}
                    className="absolute rounded-xl border-2 border-white/20"
                    style={{
                      left: minX,
                      top: minY,
                      width: maxX - minX,
                      height: maxY - minY,
                      backgroundColor:
                        clusterColors[clusterIndex % clusterColors.length],
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.3, scale: 1 }}
                    transition={{ delay: clusterIndex * 0.1 }}
                  >
                    <div className="absolute -top-8 left-4 text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                      {clusterName}
                    </div>
                  </motion.div>
                );
              },
            )}

          {/* رسم الروابط بين الصور المتشابهة */}
          {showConnections &&
            imagePositions.map((img) => {
              return imagePositions
                .filter(
                  (other) =>
                    other.id !== img.id &&
                    other.cluster === img.cluster &&
                    Math.abs(other.x - img.x) < 300 &&
                    Math.abs(other.y - img.y) < 300,
                )
                .map((connectedImg) => (
                  <motion.svg
                    key={`connection-${img.id}-${connectedImg.id}`}
                    className="absolute pointer-events-none"
                    style={{
                      left: Math.min(img.x, connectedImg.x),
                      top: Math.min(img.y, connectedImg.y),
                      width: Math.abs(connectedImg.x - img.x),
                      height: Math.abs(connectedImg.y - img.y),
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                  >
                    <line
                      x1={
                        img.x > connectedImg.x
                          ? Math.abs(connectedImg.x - img.x)
                          : 0
                      }
                      y1={
                        img.y > connectedImg.y
                          ? Math.abs(connectedImg.y - img.y)
                          : 0
                      }
                      x2={
                        img.x < connectedImg.x
                          ? Math.abs(connectedImg.x - img.x)
                          : 0
                      }
                      y2={
                        img.y < connectedImg.y
                          ? Math.abs(connectedImg.y - img.y)
                          : 0
                      }
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                    />
                  </motion.svg>
                ));
            })}

          {/* رسم الصور */}
          {imagePositions.map((img, index) => {
            const isSelected = selectedImages.has(img.id);
            const isHovered = hoveredImage === img.id;

            return (
              <motion.div
                key={img.id}
                className={`absolute cursor-pointer transition-all duration-300 ${
                  isSelected ? "z-30" : "z-10"
                }`}
                style={{
                  left: img.x - 48,
                  top: img.y - 48,
                }}
                initial={{ opacity: 0, scale: 0, rotate: 180 }}
                animate={{
                  opacity: 1,
                  scale: isSelected ? 1.4 : isHovered ? 1.2 : 1,
                  rotate: 0,
                }}
                transition={{
                  delay: index * 0.02,
                  duration: 0.6,
                  ease: "backOut",
                }}
                whileHover={{
                  scale: 1.3,
                  zIndex: 20,
                }}
                onClick={() => selectImage(img.id)}
                onHoverStart={() => setHoveredImage(img.id)}
                onHoverEnd={() => setHoveredImage(null)}
              >
                {/* الصورة */}
                <div
                  className={`w-24 h-24 rounded-xl overflow-hidden border-3 shadow-2xl transition-all ${
                    isSelected
                      ? "border-blue-400 shadow-blue-400/50"
                      : "border-white/40 shadow-black/50"
                  }`}
                >
                  {img.previewUrl ? (
                    <img
                      src={img.previewUrl}
                      alt={`Memory ${img.id}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                      <div className="text-white/60 text-xs">معالجة...</div>
                    </div>
                  )}
                </div>

                {/* مؤشر التحديد */}
                {isSelected && (
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    ✓
                  </motion.div>
                )}

                {/* معلومات عند التحويم */}
                {isHovered && (
                  <motion.div
                    className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-lg text-white text-xs rounded-lg p-2 whitespace-nowrap"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="font-medium">
                      {images.get(img.id)?.category || "عام"}
                    </div>
                    {images.get(img.id)?.description && (
                      <div className="text-white/70 max-w-32 truncate">
                        {images.get(img.id)?.description}
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}

          {/* رسالة الترحيب */}
          {imagePositions.length === 0 && (
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-white/60 text-3xl mb-4">🧠</div>
              <h2 className="text-white/80 text-2xl font-bold mb-2">
                اللوحة العصبية لذكرياتك
              </h2>
              <p className="text-white/60 text-lg">
                ابدأ بتحميل الصور لاستكشاف عالم ذكرياتك التفاعلي
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* إحصائيات التحديد */}
      {selectedImages.size > 0 && (
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500/90 backdrop-blur-lg rounded-full px-6 py-3 text-white font-medium"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          تم تحديد {selectedImages.size} صورة
        </motion.div>
      )}
    </div>
  );
}
