import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '@/lib/types';
import { z } from "zod";

const f = createUploadthing();

// Middleware for auth checking JWT in Authorization header
const authMiddleware = async (req: Request) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UploadThingError("Unauthorized: No authorization header");
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
  mediaUploader: f(["image", "video", "blob"])
    .input(z.object({
        ticketId: z.string().optional(),
        groupId: z.string().optional(),
    }))
    .middleware(async ({ req, input }) => {
      const authData = await authMiddleware(req);
      return { 
        userId: authData.userId,
        groupId: input.groupId,
        ticketId: input.ticketId,
       };
    })
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
