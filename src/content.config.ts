import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const patterns = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/patterns' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['creational', 'structural', 'behavioral']),
    intent: z.string(),
    complexity: z.enum(['low', 'medium', 'high']),
    popularity: z.enum(['low', 'medium', 'high']),
    relatedPatterns: z.array(z.string()).default([]),
    order: z.number(),
  }),
});

export const collections = { patterns };
