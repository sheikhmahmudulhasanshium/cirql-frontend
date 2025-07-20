import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '@/lib/types';

const f = createUploadthing();

const authMiddleware = async ({ req }: { req: Request }) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UploadThingError("Unauthorized: No token provided");
  }
  const token = authHeader.split(' ')[1];

  try {
    // This verify call will now succeed because process.env.JWT_SECRET is loaded from your .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    if (decoded.isTwoFactorAuthenticationComplete !== true) {
      throw new UploadThingError("Unauthorized: 2FA not completed");
    }
    return { userId: decoded.sub };
  } catch (err) {
    console.error("JWT Verification failed:", err);
    throw new UploadThingError("Unauthorized: Invalid token");
  }
};

export const ourFileRouter = {
  mediaUploader: f(["image", "video", "audio", "pdf", "blob"])
    .middleware(authMiddleware)
    .onUploadComplete(({ metadata, file }) => {
      console.log(`[UploadThing] SERVER: Upload complete for user ${metadata.userId}. File: ${file.url}`);
    }),
  
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 }})
    .middleware(authMiddleware)
    .onUploadComplete(({ metadata, file }) => {
      console.log(`[UploadThing] SERVER: Image upload complete for user ${metadata.userId}. File: ${file.url}`);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;