// cirql-frontend/app/api/uploadthing/route.ts

import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// This creates the /api/uploadthing endpoint and connects it to your router definition.
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});