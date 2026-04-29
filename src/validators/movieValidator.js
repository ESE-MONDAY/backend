import { z } from "zod";

export const MovieSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  overview: z.string().nullable().optional(),
  
  // releaseYear validation
  releaseYear: z.coerce
    .number()
    .int()
    .min(1888, "Movies didn't exist before 1888"),
    
  // Array of strings for genres
  genres: z.array(z.string()).default([]),
  
  runtime: z.coerce.number().int().positive().nullable().optional(),
  posterUrl: z.string().url("Invalid poster URL format").nullable().optional(),

});