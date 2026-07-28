import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_settings_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  ALTER TABLE "site_settings" ADD COLUMN "footer_line1" varchar DEFAULT '> JetDeck SCOUT © 2026';
  ALTER TABLE "site_settings" ADD COLUMN "footer_line2" varchar DEFAULT 'Built for hackers, makers, and dreamers.';

  WITH target AS (
    SELECT "id" FROM "site_settings" ORDER BY "id" LIMIT 1
  ),
  footer AS (
    SELECT "id", "line1", "line2" FROM "pages_blocks_footer" ORDER BY "_order" LIMIT 1
  )
  UPDATE "site_settings"
  SET
    "footer_line1" = COALESCE(footer."line1", "site_settings"."footer_line1"),
    "footer_line2" = COALESCE(footer."line2", "site_settings"."footer_line2")
  FROM target, footer
  WHERE "site_settings"."id" = target."id";

  WITH target AS (
    SELECT "id" FROM "site_settings" ORDER BY "id" LIMIT 1
  ),
  footer AS (
    SELECT "id" FROM "pages_blocks_footer" ORDER BY "_order" LIMIT 1
  )
  INSERT INTO "site_settings_footer_columns" ("_order", "_parent_id", "id", "title")
  SELECT footer_columns."_order", target."id", footer_columns."id", footer_columns."title"
  FROM "pages_blocks_footer_columns" footer_columns, target, footer
  WHERE footer_columns."_parent_id" = footer."id";

  WITH footer AS (
    SELECT "id" FROM "pages_blocks_footer" ORDER BY "_order" LIMIT 1
  )
  INSERT INTO "site_settings_footer_columns_links" ("_order", "_parent_id", "id", "label", "url")
  SELECT links."_order", links."_parent_id", links."id", links."label", links."url"
  FROM "pages_blocks_footer_columns_links" links
  WHERE links."_parent_id" IN (
    SELECT "id" FROM "pages_blocks_footer_columns" WHERE "_parent_id" = (SELECT "id" FROM footer)
  );

  ALTER TABLE "site_settings_footer_columns" ADD CONSTRAINT "site_settings_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_columns_links" ADD CONSTRAINT "site_settings_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_footer_columns_order_idx" ON "site_settings_footer_columns" USING btree ("_order");
  CREATE INDEX "site_settings_footer_columns_parent_id_idx" ON "site_settings_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_columns_links_order_idx" ON "site_settings_footer_columns_links" USING btree ("_order");
  CREATE INDEX "site_settings_footer_columns_links_parent_id_idx" ON "site_settings_footer_columns_links" USING btree ("_parent_id");

  DROP TABLE "pages_blocks_footer_columns_links" CASCADE;
  DROP TABLE "pages_blocks_footer_columns" CASCADE;
  DROP TABLE "pages_blocks_footer" CASCADE;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_footer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line1" varchar DEFAULT '> JetDeck SCOUT © 2026',
  	"line2" varchar DEFAULT 'Built for hackers, makers, and dreamers.',
  	"block_name" varchar
  );

  ALTER TABLE "pages_blocks_footer_columns_links" ADD CONSTRAINT "pages_blocks_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_footer_columns" ADD CONSTRAINT "pages_blocks_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_footer" ADD CONSTRAINT "pages_blocks_footer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_footer_columns_links_order_idx" ON "pages_blocks_footer_columns_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_footer_columns_links_parent_id_idx" ON "pages_blocks_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_footer_columns_order_idx" ON "pages_blocks_footer_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_footer_columns_parent_id_idx" ON "pages_blocks_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_footer_order_idx" ON "pages_blocks_footer" USING btree ("_order");
  CREATE INDEX "pages_blocks_footer_parent_id_idx" ON "pages_blocks_footer" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_footer_path_idx" ON "pages_blocks_footer" USING btree ("_path");

  DROP TABLE "site_settings_footer_columns_links" CASCADE;
  DROP TABLE "site_settings_footer_columns" CASCADE;
  ALTER TABLE "site_settings" DROP COLUMN "footer_line1";
  ALTER TABLE "site_settings" DROP COLUMN "footer_line2";`)
}
