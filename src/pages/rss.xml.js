import rss, { pagesGlobToRssItems } from '@astrojs/rss';
import { rssSchema } from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
const posts = await getCollection('games');
  return rss({
    site: context.site,
    title: 'Kemono',
    description: 'A Kemono website',
    items: posts.map((post) => ({
        title: post.data.title,
        pubDate: post.data.publishedDate,
        description: post.data.description,
        link: `/games/${post.id.replace(/\.mdx$/, '')}`,
      })),
  });
}