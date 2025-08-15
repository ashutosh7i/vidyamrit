import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from "fs";
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH || "./serviceAccountKey.json";
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));

try {
    initializeApp({
        credential: cert(serviceAccount),
    });
    logger.info("Firebase initialized successfully.");
    console.log("Firebase initialized successfully.");
} catch (error) {
    logger.error(`Firebase initialization failed: ${error}`);
    console.error("Firebase initialization failed:", error);
}

export const verifyToken = async (token: string) => {
    return getAuth().verifyIdToken(token);
};