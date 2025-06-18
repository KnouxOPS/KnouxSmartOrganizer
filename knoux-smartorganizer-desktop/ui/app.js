const { useState, useEffect, useRef } = React;

function App() {
  // Application State
  const [appInfo, setAppInfo] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [sourceFolder, setSourceFolder] = useState("");

  // Refs
  const logRef = useRef(null);

  // Initialize app
  useEffect(() => {
    initializeApp();
    setupEventListeners();

    return () => {
      // Cleanup listeners
      window.electronAPI.removeAllListeners("update-progress");
      window.electronAPI.removeAllListeners("update-progress-percent");
      window.electronAPI.removeAllListeners("models-loaded");
      window.electronAPI.removeAllListeners("organization-complete");
    };
  }, []);

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [progress]);

  const initializeApp = async () => {
    try {
      const info = await window.electronAPI.getAppInfo();
      setAppInfo(info);
      setModelsLoaded(info.modelsLoaded);
      setSourceFolder(info.directories?.images?.raw || "");
      setProgress("تم تحميل التطبيق بنجا��. جاري تهيئة النماذج...");
    } catch (err) {
      setError(`فشل في تهيئة التطبيق: ${err.message}`);
    }
  };

  const setupEventListeners = () => {
    window.electronAPI.onUpdateProgress((message) => {
      setProgress((prev) => `${prev}\n${message}`);
    });

    window.electronAPI.onUpdateProgressPercent((percent) => {
      setProgressPercent(percent);
    });

    window.electronAPI.onModelsLoaded((loaded) => {
      setModelsLoaded(loaded);
      if (loaded) {
        setSuccess("🎉 جميع نماذج الذكاء الاصطناعي جاهزة للاستخدام!");
      }
    });

    window.electronAPI.onOrganizationComplete((result) => {
      setIsProcessing(false);
      setProgressPercent(100);

      if (result.success) {
        setStats(result.stats);
        setSuccess(
          `🎉 تم تنظيم الصور بنجاح! تمت معالجة ${result.stats.processed} صورة`,
        );
      } else {
        setError(`فشل في التنظيم: ${result.error}`);
      }
    });
  };

  const handleSelectFolder = async () => {
    try {
      const result = await window.electronAPI.selectSourceFolder();
      if (result.success) {
        setSourceFolder(result.path);
        setProgress((prev) => `${prev}\nتم اختيار مجلد المصدر: ${result.path}`);
      }
    } catch (err) {
      setError(`فشل في اختيار المجلد: ${err.message}`);
    }
  };

  const handleStartOrganization = async () => {
    if (!modelsLoaded) {
      setError("يجب انتظار تحميل النماذج أولاً");
      return;
    }

    if (isProcessing) {
      setError("عملية أخرى قيد التنفيذ");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    setStats(null);
    setProgressPercent(0);
    setProgress("بدء عملية التنظيم الذكي...");

    try {
      await window.electronAPI.runOrganization();
    } catch (err) {
      setIsProcessing(false);
      setError(`فشل في بدء التنظيم: ${err.message}`);
    }
  };

  const handleOpenFolder = async (folderType) => {
    try {
      await window.electronAPI.openFolder(folderType);
    } catch (err) {
      setError(`فشل في فتح المجلد: ${err.message}`);
    }
  };

  const getStatusBadge = () => {
    if (!modelsLoaded) {
      return (
        <span className="status-badge status-loading">
          جاري تحميل النماذج...
          <span className="loading-spinner"></span>
        </span>
      );
    }

    if (isProcessing) {
      return (
        <span className="status-badge status-loading">
          معالجة جارية... {progressPercent}%
          <span className="loading-spinner"></span>
        </span>
      );
    }

    return <span className="status-badge status-ready">جاهز للاستخدام ✨</span>;
  };

  const formatStats = (stats) => {
    if (!stats) return null;

    return [
      { label: "إجمالي الصور", value: stats.total },
      { label: "تمت معالجتها", value: stats.processed },
      { label: "وجوه مكتشفة", value: stats.faces },
      { label: "محتوى حساس", value: stats.nsfw },
      { label: "وثائق", value: stats.documents },
      { label: "صور متكررة", value: stats.duplicates },
      { label: "تم نقلها", value: stats.moved },
      { label: "أخطاء", value: stats.errors },
    ];
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header fade-in">
        <h1>Knoux SmartOrganizer PRO</h1>
        <p>منظم الصور الذكي بتقنية الذكاء الاصطناعي المتطورة</p>
        {getStatusBadge()}
        {appInfo && (
          <div style={{ marginTop: "10px", fontSize: "0.9rem", opacity: 0.8 }}>
            الإصدار {appInfo.version} | {appInfo.name}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Control Panel */}
        <div className="card fade-in">
          <h2>🎛️ لوحة التحكم</h2>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "10px" }}>
              مجلد الصور المصدر:
            </label>
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn btn-secondary"
                onClick={handleSelectFolder}
                style={{ flex: "0 0 auto" }}
              >
                📁 اختيار مجلد
              </button>
              {sourceFolder && (
                <div
                  style={{
                    flex: "1",
                    minWidth: "200px",
                    padding: "10px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    wordBreak: "break-all",
                  }}
                >
                  {sourceFolder}
                </div>
              )}
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleStartOrganization}
            disabled={!modelsLoaded || isProcessing}
          >
            {isProcessing ? (
              <>
                ⏳ جاري التنظيم... ({progressPercent}%)
                <span className="loading-spinner"></span>
              </>
            ) : (
              "🚀 بدء التنظيم الذكي"
            )}
          </button>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="progress-container fade-in">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div style={{ textAlign: "center", fontSize: "0.9rem" }}>
                {progressPercent}% مكتمل
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div style={{ marginTop: "30px" }}>
            <h3 style={{ marginBottom: "15px", fontSize: "1.2rem" }}>
              🔗 الوصول السريع
            </h3>
            <div className="folder-grid">
              <div
                className="folder-item"
                onClick={() => handleOpenFolder("raw")}
              >
                <span className="folder-icon">📥</span>
                <div>مجلد المصدر</div>
              </div>
              <div
                className="folder-item"
                onClick={() => handleOpenFolder("processed")}
              >
                <span className="folder-icon">⚙️</span>
                <div>الصور المعالجة</div>
              </div>
              <div
                className="folder-item"
                onClick={() => handleOpenFolder("classified")}
              >
                <span className="folder-icon">📂</span>
                <div>الصور المصنفة</div>
              </div>
            </div>
          </div>
        </div>

        {/* Monitor Panel */}
        <div className="card fade-in">
          <h2>📊 شاشة المراقبة</h2>

          {/* Alerts */}
          {error && (
            <div className="alert alert-error fade-in">
              <strong>خطأ:</strong> {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success fade-in">
              <strong>نجح:</strong> {success}
            </div>
          )}

          {!modelsLoaded && !error && (
            <div className="alert alert-warning">
              <strong>تحميل:</strong> جاري تحميل نماذج الذكاء الاصطناعي... يرجى
              الانتظار
            </div>
          )}

          {/* Statistics */}
          {stats && (
            <div className="fade-in">
              <h3 style={{ marginBottom: "15px" }}>📈 الإحصائيات</h3>
              <div className="stats-grid">
                {formatStats(stats).map((stat, index) => (
                  <div key={index} className="stat-item">
                    <span className="stat-number">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>

              {stats.classifications &&
                Object.keys(stats.classifications).length > 0 && (
                  <div style={{ marginTop: "20px" }}>
                    <h4 style={{ marginBottom: "10px" }}>🏷️ التصنيفات:</h4>
                    <div className="stats-grid">
                      {Object.entries(stats.classifications).map(
                        ([category, count]) => (
                          <div key={category} className="stat-item">
                            <span className="stat-number">{count}</span>
                            <span className="stat-label">{category}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* Live Log */}
          <div style={{ marginTop: "20px" }}>
            <h3 style={{ marginBottom: "10px" }}>📜 سجل العمليات المباشر</h3>
            <div className="log-container" ref={logRef}>
              {progress || "في انتظار بدء العملية..."}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          marginTop: "30px",
          padding: "20px",
          opacity: 0.7,
          fontSize: "0.9rem",
        }}
      >
        <p>
          Knoux SmartOrganizer PRO - تطبيق مكتبي للتنظيم الذكي للصور
          <br />
          جميع العمليات تتم محلياً بدون إرسال بيانات للإنترنت
        </p>
      </div>
    </div>
  );
}

// Render the app
ReactDOM.render(<App />, document.getElementById("root"));
