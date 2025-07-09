// src/lib/uploadthing.ts
import { generateReactHelpers } from '@uploadthing/react';

// --- THIS IS THE FIX ---
// We call the function *without* the generic type parameter.
// This makes the library default to accepting a `string` for the endpoint,
// which is simple and resolves all type constraint errors.
export const { useUploadThing, uploadFiles } = generateReactHelpers();
// --- END OF FIX ---