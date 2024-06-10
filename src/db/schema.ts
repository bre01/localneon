import { pgTable, serial, text, doublePrecision,integer } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name'),
  description: text('description'),
  price: doublePrecision('price'),
});
export const user1=pgTable("user1",{
  id:serial('id').primaryKey(),
  group:integer("group"),
  word:text("word"),
})