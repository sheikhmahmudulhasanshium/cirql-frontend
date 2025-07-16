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
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    if (decoded.isTwoFactorAuthenticationComplete !== true) {
      throw new UploadThingError("Unauthorized: 2FA not completed");
    }
    return { userId: decoded.sub };
  } catch {
    throw new UploadThingError("Unauthorized: Invalid token");
  }
};

export const ourFileRouter = {
  mediaUploader: f(["image", "video", "audio", "pdf", "blob"])
    .middleware(authMiddleware)
    .onUploadComplete(({ metadata }) => { // --- FIX: Only destructure what is used ---
      console.log(`[UploadThing] Upload complete for user ${metadata.userId}. Webhook will now process.`);
    }),
  
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 }})
    .middleware(authMiddleware)
    .onUploadComplete(({ metadata }) => { // --- FIX: Only destructure what is used ---
      console.log(`[UploadThing] Image upload complete for user ${metadata.userId}.`);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;