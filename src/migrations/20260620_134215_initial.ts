import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_cta_ctas_variant" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_pages_blocks_cta_ctas_icon" AS ENUM('none', 'externalLink', 'discord', 'terminal');
  CREATE TYPE "public"."enum_pages_blocks_cta_align" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum_pages_blocks_quick_stats_stats_icon" AS ENUM('Antenna', 'Battery', 'Bluetooth', 'Camera', 'Cpu', 'EthernetPort', 'ExternalLink', 'Gamepad2', 'Gpu', 'HardDrive', 'Heart', 'Keyboard', 'MemoryStick', 'Radio', 'Terminal', 'Usb', 'Wifi', 'Zap');
  CREATE TYPE "public"."enum_pages_blocks_quick_stats_stats_color" AS ENUM('cyan', 'blue', 'purple', 'green', 'yellow', 'orange', 'red', 'pink');
  CREATE TYPE "public"."enum_pages_blocks_detail_stat_icon" AS ENUM('Antenna', 'Battery', 'Bluetooth', 'Camera', 'Cpu', 'EthernetPort', 'ExternalLink', 'Gamepad2', 'Gpu', 'HardDrive', 'Heart', 'Keyboard', 'MemoryStick', 'Radio', 'Terminal', 'Usb', 'Wifi', 'Zap');
  CREATE TYPE "public"."enum_pages_blocks_detail_stat_color" AS ENUM('cyan', 'blue', 'purple', 'green', 'yellow', 'orange', 'red', 'pink');
  CREATE TYPE "public"."enum_pages_blocks_cta_container_ctas_variant" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_pages_blocks_cta_container_ctas_icon" AS ENUM('none', 'externalLink', 'discord', 'terminal');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title_primary" varchar DEFAULT 'JetDeck' NOT NULL,
  	"title_secondary" varchar DEFAULT 'SCOUT' NOT NULL,
  	"tagline" varchar DEFAULT 'Smart Cyber Ops Utility Tool',
  	"subtagline" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_single_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"constrain_width" boolean DEFAULT false,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_photo_carousel_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_blocks_photo_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"caption" varchar,
  	"constrain_width" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_pages_blocks_cta_ctas_variant" DEFAULT 'primary' NOT NULL,
  	"icon" "enum_pages_blocks_cta_ctas_icon" DEFAULT 'externalLink' NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"align" "enum_pages_blocks_cta_align" DEFAULT 'center' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_text_block_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_quick_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_quick_stats_stats_icon" NOT NULL,
  	"color" "enum_pages_blocks_quick_stats_stats_color" NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_quick_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_detail_stat_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_detail_stat" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_detail_stat_icon" DEFAULT 'Cpu',
  	"color" "enum_pages_blocks_detail_stat_color" DEFAULT 'cyan',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_specs_table_tabs_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_specs_table_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_specs_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Technical Specifications',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_container_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta_container_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_pages_blocks_cta_container_ctas_variant" DEFAULT 'primary' NOT NULL,
  	"icon" "enum_pages_blocks_cta_container_ctas_icon" DEFAULT 'externalLink' NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta_container" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Ready to Join the Revolution?' NOT NULL,
  	"subtext" varchar,
  	"block_name" varchar
  );
  
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
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"path" varchar DEFAULT '/' NOT NULL,
  	"show_navigation" boolean DEFAULT true,
  	"show_in_nav" boolean DEFAULT false,
  	"nav_label" varchar,
  	"nav_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"pages_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_nav_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nav_brand_label" varchar DEFAULT 'JetDeck SCOUT',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_single_image" ADD CONSTRAINT "pages_blocks_single_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_single_image" ADD CONSTRAINT "pages_blocks_single_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_photo_carousel_images" ADD CONSTRAINT "pages_blocks_photo_carousel_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_photo_carousel_images" ADD CONSTRAINT "pages_blocks_photo_carousel_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_photo_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_photo_carousel" ADD CONSTRAINT "pages_blocks_photo_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_ctas" ADD CONSTRAINT "pages_blocks_cta_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_text_block_paragraphs" ADD CONSTRAINT "pages_blocks_text_block_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_text_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_text_block" ADD CONSTRAINT "pages_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_quick_stats_stats" ADD CONSTRAINT "pages_blocks_quick_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_quick_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_quick_stats" ADD CONSTRAINT "pages_blocks_quick_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_detail_stat_lines" ADD CONSTRAINT "pages_blocks_detail_stat_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_detail_stat"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_detail_stat" ADD CONSTRAINT "pages_blocks_detail_stat_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_specs_table_tabs_rows" ADD CONSTRAINT "pages_blocks_specs_table_tabs_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_specs_table_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_specs_table_tabs" ADD CONSTRAINT "pages_blocks_specs_table_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_specs_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_specs_table" ADD CONSTRAINT "pages_blocks_specs_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_container_paragraphs" ADD CONSTRAINT "pages_blocks_cta_container_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_container"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_container_ctas" ADD CONSTRAINT "pages_blocks_cta_container_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_container"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_container" ADD CONSTRAINT "pages_blocks_cta_container_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_footer_columns_links" ADD CONSTRAINT "pages_blocks_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_footer_columns" ADD CONSTRAINT "pages_blocks_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_footer" ADD CONSTRAINT "pages_blocks_footer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_nav_links" ADD CONSTRAINT "site_settings_nav_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_single_image_order_idx" ON "pages_blocks_single_image" USING btree ("_order");
  CREATE INDEX "pages_blocks_single_image_parent_id_idx" ON "pages_blocks_single_image" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_single_image_path_idx" ON "pages_blocks_single_image" USING btree ("_path");
  CREATE INDEX "pages_blocks_single_image_image_idx" ON "pages_blocks_single_image" USING btree ("image_id");
  CREATE INDEX "pages_blocks_photo_carousel_images_order_idx" ON "pages_blocks_photo_carousel_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_photo_carousel_images_parent_id_idx" ON "pages_blocks_photo_carousel_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_photo_carousel_images_image_idx" ON "pages_blocks_photo_carousel_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_photo_carousel_order_idx" ON "pages_blocks_photo_carousel" USING btree ("_order");
  CREATE INDEX "pages_blocks_photo_carousel_parent_id_idx" ON "pages_blocks_photo_carousel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_photo_carousel_path_idx" ON "pages_blocks_photo_carousel" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_ctas_order_idx" ON "pages_blocks_cta_ctas" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_ctas_parent_id_idx" ON "pages_blocks_cta_ctas" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_text_block_paragraphs_order_idx" ON "pages_blocks_text_block_paragraphs" USING btree ("_order");
  CREATE INDEX "pages_blocks_text_block_paragraphs_parent_id_idx" ON "pages_blocks_text_block_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_text_block_order_idx" ON "pages_blocks_text_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_text_block_parent_id_idx" ON "pages_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_text_block_path_idx" ON "pages_blocks_text_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_quick_stats_stats_order_idx" ON "pages_blocks_quick_stats_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_quick_stats_stats_parent_id_idx" ON "pages_blocks_quick_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_quick_stats_order_idx" ON "pages_blocks_quick_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_quick_stats_parent_id_idx" ON "pages_blocks_quick_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_quick_stats_path_idx" ON "pages_blocks_quick_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_detail_stat_lines_order_idx" ON "pages_blocks_detail_stat_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_detail_stat_lines_parent_id_idx" ON "pages_blocks_detail_stat_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_detail_stat_order_idx" ON "pages_blocks_detail_stat" USING btree ("_order");
  CREATE INDEX "pages_blocks_detail_stat_parent_id_idx" ON "pages_blocks_detail_stat" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_detail_stat_path_idx" ON "pages_blocks_detail_stat" USING btree ("_path");
  CREATE INDEX "pages_blocks_specs_table_tabs_rows_order_idx" ON "pages_blocks_specs_table_tabs_rows" USING btree ("_order");
  CREATE INDEX "pages_blocks_specs_table_tabs_rows_parent_id_idx" ON "pages_blocks_specs_table_tabs_rows" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_specs_table_tabs_order_idx" ON "pages_blocks_specs_table_tabs" USING btree ("_order");
  CREATE INDEX "pages_blocks_specs_table_tabs_parent_id_idx" ON "pages_blocks_specs_table_tabs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_specs_table_order_idx" ON "pages_blocks_specs_table" USING btree ("_order");
  CREATE INDEX "pages_blocks_specs_table_parent_id_idx" ON "pages_blocks_specs_table" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_specs_table_path_idx" ON "pages_blocks_specs_table" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_container_paragraphs_order_idx" ON "pages_blocks_cta_container_paragraphs" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_container_paragraphs_parent_id_idx" ON "pages_blocks_cta_container_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_container_ctas_order_idx" ON "pages_blocks_cta_container_ctas" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_container_ctas_parent_id_idx" ON "pages_blocks_cta_container_ctas" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_container_order_idx" ON "pages_blocks_cta_container" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_container_parent_id_idx" ON "pages_blocks_cta_container" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_container_path_idx" ON "pages_blocks_cta_container" USING btree ("_path");
  CREATE INDEX "pages_blocks_footer_columns_links_order_idx" ON "pages_blocks_footer_columns_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_footer_columns_links_parent_id_idx" ON "pages_blocks_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_footer_columns_order_idx" ON "pages_blocks_footer_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_footer_columns_parent_id_idx" ON "pages_blocks_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_footer_order_idx" ON "pages_blocks_footer" USING btree ("_order");
  CREATE INDEX "pages_blocks_footer_parent_id_idx" ON "pages_blocks_footer" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_footer_path_idx" ON "pages_blocks_footer" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_path_idx" ON "pages" USING btree ("path");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_nav_links_order_idx" ON "site_settings_nav_links" USING btree ("_order");
  CREATE INDEX "site_settings_nav_links_parent_id_idx" ON "site_settings_nav_links" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_single_image" CASCADE;
  DROP TABLE "pages_blocks_photo_carousel_images" CASCADE;
  DROP TABLE "pages_blocks_photo_carousel" CASCADE;
  DROP TABLE "pages_blocks_cta_ctas" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_text_block_paragraphs" CASCADE;
  DROP TABLE "pages_blocks_text_block" CASCADE;
  DROP TABLE "pages_blocks_quick_stats_stats" CASCADE;
  DROP TABLE "pages_blocks_quick_stats" CASCADE;
  DROP TABLE "pages_blocks_detail_stat_lines" CASCADE;
  DROP TABLE "pages_blocks_detail_stat" CASCADE;
  DROP TABLE "pages_blocks_specs_table_tabs_rows" CASCADE;
  DROP TABLE "pages_blocks_specs_table_tabs" CASCADE;
  DROP TABLE "pages_blocks_specs_table" CASCADE;
  DROP TABLE "pages_blocks_cta_container_paragraphs" CASCADE;
  DROP TABLE "pages_blocks_cta_container_ctas" CASCADE;
  DROP TABLE "pages_blocks_cta_container" CASCADE;
  DROP TABLE "pages_blocks_footer_columns_links" CASCADE;
  DROP TABLE "pages_blocks_footer_columns" CASCADE;
  DROP TABLE "pages_blocks_footer" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_nav_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_cta_ctas_variant";
  DROP TYPE "public"."enum_pages_blocks_cta_ctas_icon";
  DROP TYPE "public"."enum_pages_blocks_cta_align";
  DROP TYPE "public"."enum_pages_blocks_quick_stats_stats_icon";
  DROP TYPE "public"."enum_pages_blocks_quick_stats_stats_color";
  DROP TYPE "public"."enum_pages_blocks_detail_stat_icon";
  DROP TYPE "public"."enum_pages_blocks_detail_stat_color";
  DROP TYPE "public"."enum_pages_blocks_cta_container_ctas_variant";
  DROP TYPE "public"."enum_pages_blocks_cta_container_ctas_icon";`)
}
