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
import { products } from './db/schema';
import { Hono } from 'hono';
import { PgSelect } from 'drizzle-orm/pg-core';


export type Env = {
	DATABASE_URL: string;
  };
  
  const app = new Hono<{ Bindings: Env }>();
  
  app.get('/', async (c) => {
	const sql = neon(c.env.DATABASE_URL);
	const db = drizzle(sql);
	const result = await db.select().from(products);
	return c.json({ result });
  });
  
  app.get('/products',async(c)=>{
	const sql=neon(c.env.DATABASE_URL);
	const db=drizzle(sql);
	const results:Promise<{price:number|null,name:string|null}[]>=db.select({price:products.price,name:products.name}).from(products);
	return c.json({ results:await results})
  }
)
  

  
  app.onError((error, c) => {
	console.log(error)
	return c.json({ error }, 400)
  })

export default app;




