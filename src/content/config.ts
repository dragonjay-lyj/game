import { defineCollection, z } from "astro:content";

export const collections = {
  games: defineCollection({
    schema: z.object({
      title: z.string(),
      releaseYear: z.union([z.string(), z.number()]).optional(),
      releaseDate: z.string().optional(),
      coverImage: z.string(),
      logoImage: z.string().optional(),
      description: z.string().optional(),
      fileSize: z.string().optional(),
      version: z.string().optional(),
      developer: z.string().optional(),
      publisher: z.string().optional(),
      genres: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      platforms: z.array(z.string()).optional(),
      languages: z.object({
        interface: z.array(z.string()).optional(),
        audio: z.array(z.string()).optional(),
      }).optional(),
      systemRequirements: z.object({
        minimum: z.record(z.string()).optional(),
        recommended: z.record(z.string()).optional(),
      }).optional(),
      screenshots: z.array(z.object({
        src: z.string(),
        thumbnail: z.string().optional(),
        alt: z.string().optional(),
      })).optional(),
      videos: z.array(z.object({
        webm: z.string().optional(),
        mp4: z.string().optional(),
        thumbnail: z.string().optional(),
      })).optional(),
      downloadOptions: z.array(z.object({
        type: z.string(),
        name: z.string(),
        url: z.string(),
        description: z.string().optional(),
      })).optional(),
      controllerSupport: z.object({
        full: z.boolean().optional(),
        xbox: z.boolean().optional(),
        dualshock: z.boolean().optional(),
        dualsense: z.boolean().optional(),
        steamDeck: z.enum(['verified', 'playable', 'unsupported', 'unknown']).optional(),
        other: z.boolean().optional(),
      }).optional(),
      publishedDate: z.date().optional(),
      updatedDate: z.date().optional(),
    }),
  }),
};
