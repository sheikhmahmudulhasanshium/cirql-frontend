import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// --- START OF FIX ---
// Export a new route handler with the callbackUrl configured.
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    // This explicitly tells UploadThing where to send its webhooks.
    callbackUrl: process.env.UPLOADTHING_CALLBACK_URL,
  },
});
// --- END OF FIX ---