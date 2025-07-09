// src/app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '@/lib/types';

const f = createUploadthing();

const authMiddleware = async ({ req }: { req: Request }) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error("Unauthorized: No token provided");
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (decoded.isTwoFactorAuthenticationComplete !== true) {
        throw new Error("Unauthorized: 2FA not completed");
    }
    
    return { userId: decoded.sub };
  } catch {
    throw new Error("Unauthorized: Invalid token");
  }
};

export const ourFileRouter = {
  mediaUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 10 },
    audio: { maxFileSize: "32MB", maxFileCount: 5 },
    video: { maxFileSize: "256MB", maxFileCount: 2 },
  })
    .middleware(authMiddleware)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("[UploadThing] Upload successful. Sending metadata to backend...");
      
      try {
        // --- FIX: The path now matches the simplified backend route ---
        const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/media`;
        const webhookSecret = process.env.UPLOADTHING_WEBHOOK_SECRET;

        if (!webhookSecret) {
          throw new Error("UPLOADTHING_WEBHOOK_SECRET is not configured on the server.");
        }

        const response = await fetch(backendUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-uploadthing-webhook-secret': webhookSecret, 
          },
          body: JSON.stringify({
            userId: metadata.userId,
            url: file.url,
            key: file.key,
            filename: file.name,
            size: file.size,
            type: file.type,
          })
        });

        if (!response.ok) {
          const errorBody = await response.text();
          console.error(`[UploadThing] Failed to save metadata. Backend responded with ${response.status}:`, errorBody);
          throw new Error("Backend failed to process metadata.");
        }

        console.log("[UploadThing] Successfully saved metadata to backend.");

      } catch (error) {
        console.error("[UploadThing] CRITICAL: Could not save file metadata to backend.", error);
      }
    }),
  
  profilePicture: f({ image: { maxFileSize: "4MB", maxFileCount: 1 }})
    .middleware(authMiddleware)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(`[UploadThing] Profile picture uploaded for ${metadata.userId}: ${file.url}`);
    }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;