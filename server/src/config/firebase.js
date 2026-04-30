import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

let app;

if (!admin.apps.length) {
  if (process.env.NODE_ENV === "test") {
    console.log("Skipping Firebase initialization in test environment");
  } 
  else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      console.log("Firebase initialized from ENV");
    } catch (err) {
      console.error("Invalid Firebase ENV:", err.message);
    }
  } 
  else {
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      const filePath = path.join(__dirname, "../../firebaseServiceAccount.json");

      if (fs.existsSync(filePath)) {
        const serviceAccount = JSON.parse(
          fs.readFileSync(filePath, "utf-8")
        );

        app = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });

        console.log("Firebase initialized from local file");
      } else {
        console.log("Firebase not configured (no file, no ENV)");
      }
    } catch (err) {
      console.error("Firebase init error:", err.message);
    }
  }
}

export default admin;