const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");

console.log("🚀 Setting up Knoux SmartOrganizer PRO...\n");

async function setup() {
  try {
    // 1. Create UI directory if it doesn't exist
    console.log("📁 Creating UI structure...");
    await fs.ensureDir("ui/src");
    await fs.ensureDir("ui/public");

    // 2. Install root dependencies
    console.log("📦 Installing main dependencies...");
    execSync("npm install", { stdio: "inherit" });

    // 3. Setup React app
    console.log("⚛️ Setting up React UI...");
    process.chdir("ui");
    execSync("npm install", { stdio: "inherit" });
    process.chdir("..");

    // 4. Create models directory
    console.log("🧠 Creating models directory...");
    await fs.ensureDir("models/face-api");
    await fs.ensureDir("models/nsfwjs");
    await fs.ensureDir("models/mobilenet");

    // 5. Create assets directory
    console.log("🎨 Creating assets directory...");
    await fs.ensureDir("assets");

    // 6. Create sample icon (placeholder)
    const iconData = "🧠"; // You can replace this with actual icon file
    await fs.writeFile("assets/icon.png", iconData);

    // 7. Create logs directory in user documents
    const os = require("os");
    const userDocsPath = path.join(
      os.homedir(),
      "Documents",
      "KnouxSmartOrganizer",
    );

    console.log("📂 Creating user directories...");
    await fs.ensureDir(path.join(userDocsPath, "images", "raw"));
    await fs.ensureDir(path.join(userDocsPath, "images", "renamed"));
    await fs.ensureDir(path.join(userDocsPath, "images", "classified", "nsfw"));
    await fs.ensureDir(
      path.join(userDocsPath, "images", "classified", "selfies"),
    );
    await fs.ensureDir(
      path.join(userDocsPath, "images", "classified", "documents"),
    );
    await fs.ensureDir(
      path.join(userDocsPath, "images", "classified", "duplicates"),
    );
    await fs.ensureDir(
      path.join(userDocsPath, "images", "classified", "nature"),
    );
    await fs.ensureDir(path.join(userDocsPath, "images", "classified", "food"));
    await fs.ensureDir(
      path.join(userDocsPath, "images", "classified", "screenshots"),
    );
    await fs.ensureDir(
      path.join(userDocsPath, "images", "classified", "general"),
    );
    await fs.ensureDir(path.join(userDocsPath, "logs"));

    console.log("\n✅ Setup completed successfully!");
    console.log("\n📋 Next steps:");
    console.log('1. Run "npm run dev" to start development');
    console.log('2. Run "npm run build-win" to build for Windows');
    console.log('3. Run "npm run build-mac" to build for macOS');
    console.log(`\n📁 Your organized images will be saved to:`);
    console.log(`   ${userDocsPath}`);
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    process.exit(1);
  }
}

setup();
