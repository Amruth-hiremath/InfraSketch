import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

let app;

if (!admin.apps.length) {
  // 🚨 Skip Firebase in test/CI
  if (process.env.NODE_ENV === "test") {
    console.log("Skipping Firebase initialization in test environment");
  } else {
    let serviceAccount;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      serviceAccount = JSON.parse(
        fs.readFileSync(
          path.join(__dirname, "../../firebaseServiceAccount.json"),
          "utf-8"
        )
      );
    }

    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}

export default admin;