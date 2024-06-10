/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { products, user1 } from './db/schema';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

export type Env = {
	DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();
app.use('/*', cors());

app.get('/', async (c) => {
	const sql = neon(c.env.DATABASE_URL);
	const db = drizzle(sql);
	const result = await db.select().from(products);
	console.log('here');
	return c.json({ result });
});

app.get('/products', async (c) => {
	const sql = neon(c.env.DATABASE_URL);
	const db = drizzle(sql);
	const results: Promise<{ price: number | null; name: string | null }[]> = db
		.select({ price: products.price, name: products.name })
		.from(products);
	return c.json({ results: await results });
});
app.get('/save', async (c) => {
	const sql = neon(c.env.DATABASE_URL);
	const db = drizzle(sql);
	const word = c.req.query('w');
	console.log(word);
	const group = parseInt(c.req.query('g') as string);
	const result = await db.insert(user1).values({ group, word }).returning();
	return c.json(result);
});
app.post('/chunk', async (c) => {
	const sql = neon(c.env.DATABASE_URL);
	const db = drizzle(sql);
	const body = await c.req.json();
	const words = [];
	for (const [key, value] of Object.entries(body)) {
		words.push({ group: parseInt(value as string), word: key as string });
	}
	const result = await db.insert(user1).values(words).returning();
	return c.json(result);
});

app.get('/fetch', async (c) => {
	const sql = neon(c.env.DATABASE_URL);
	const db = drizzle(sql);
	const result = await db.select({ group: user1.group, word: user1.word }).from(user1);
	return c.json(result);
});

app.onError((error, c) => {
	console.log(error);
	return c.json({ error }, 400);
});

export default app;
