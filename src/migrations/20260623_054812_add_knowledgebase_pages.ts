import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_knowledgebase_index_variant" AS ENUM('standalone', 'sidebar');
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_knowledgebase_index" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Knowledgebase',
  	"intro" varchar,
  	"variant" "enum_pages_blocks_knowledgebase_index_variant" DEFAULT 'standalone' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_file_download" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages" ADD COLUMN "is_knowledgebase_page" boolean DEFAULT false;
  ALTER TABLE "pages" ADD COLUMN "knowledgebase_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "knowledgebase_description" varchar;
  ALTER TABLE "pages" ADD COLUMN "knowledgebase_parent_id" integer;
  ALTER TABLE "pages" ADD COLUMN "knowledgebase_order" numeric DEFAULT 0;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_knowledgebase_index" ADD CONSTRAINT "pages_blocks_knowledgebase_index_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_file_download" ADD CONSTRAINT "pages_blocks_file_download_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_knowledgebase_index_order_idx" ON "pages_blocks_knowledgebase_index" USING btree ("_order");
  CREATE INDEX "pages_blocks_knowledgebase_index_parent_id_idx" ON "pages_blocks_knowledgebase_index" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_knowledgebase_index_path_idx" ON "pages_blocks_knowledgebase_index" USING btree ("_path");
  CREATE INDEX "pages_blocks_file_download_order_idx" ON "pages_blocks_file_download" USING btree ("_order");
  CREATE INDEX "pages_blocks_file_download_parent_id_idx" ON "pages_blocks_file_download" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_file_download_path_idx" ON "pages_blocks_file_download" USING btree ("_path");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_knowledgebase_parent_id_pages_id_fk" FOREIGN KEY ("knowledgebase_parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_knowledgebase_parent_idx" ON "pages" USING btree ("knowledgebase_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_knowledgebase_index" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_file_download" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_knowledgebase_index" CASCADE;
  DROP TABLE "pages_blocks_file_download" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_knowledgebase_parent_id_pages_id_fk";
  
  DROP INDEX "pages_knowledgebase_parent_idx";
  ALTER TABLE "pages" DROP COLUMN "is_knowledgebase_page";
  ALTER TABLE "pages" DROP COLUMN "knowledgebase_label";
  ALTER TABLE "pages" DROP COLUMN "knowledgebase_description";
  ALTER TABLE "pages" DROP COLUMN "knowledgebase_parent_id";
  ALTER TABLE "pages" DROP COLUMN "knowledgebase_order";
  DROP TYPE "public"."enum_pages_blocks_knowledgebase_index_variant";`)
}
