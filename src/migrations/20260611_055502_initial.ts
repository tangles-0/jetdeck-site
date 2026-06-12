import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_content_stats_icon" AS ENUM('Antenna', 'Battery', 'Bluetooth', 'Camera', 'Cpu', 'EthernetPort', 'Gamepad2', 'Gpu', 'HardDrive', 'Heart', 'Keyboard', 'MemoryStick', 'Radio', 'Terminal', 'Usb', 'Wifi', 'Zap');
  CREATE TYPE "public"."enum_site_content_stats_color" AS ENUM('cyan', 'blue', 'purple', 'green', 'yellow', 'orange', 'red', 'pink');
  CREATE TYPE "public"."enum_site_content_compute_note_icon" AS ENUM('Antenna', 'Battery', 'Bluetooth', 'Camera', 'Cpu', 'EthernetPort', 'Gamepad2', 'Gpu', 'HardDrive', 'Heart', 'Keyboard', 'MemoryStick', 'Radio', 'Terminal', 'Usb', 'Wifi', 'Zap');
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
  
  CREATE TABLE "site_content_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_site_content_stats_icon" NOT NULL,
  	"color" "enum_site_content_stats_color" NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "site_content_compute_note_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "site_content_what_is_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "site_content_photo_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "site_content_resin_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "site_content_spec_tabs_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "site_content_spec_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "site_content_pcb_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "site_content_about_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "site_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_title_primary" varchar DEFAULT 'JetDeck' NOT NULL,
  	"hero_title_secondary" varchar DEFAULT 'SCOUT' NOT NULL,
  	"hero_tagline" varchar DEFAULT 'Smart Cyber Ops Utility Tool',
  	"hero_sub_tagline" varchar,
  	"hero_animation_id" integer,
  	"kickstarter_label" varchar DEFAULT 'Back on Kickstarter',
  	"kickstarter_url" varchar,
  	"discord_label" varchar DEFAULT 'Join Discord',
  	"discord_url" varchar,
  	"compute_note_icon" "enum_site_content_compute_note_icon" DEFAULT 'Cpu',
  	"what_is_heading" varchar DEFAULT 'What is the JetDeck SCOUT?',
  	"badge_text" varchar DEFAULT 'Now Live on Kickstarter',
  	"badge_url" varchar,
  	"photo_caption" varchar DEFAULT '*prototype designs shown',
  	"specs_heading" varchar DEFAULT 'Technical Specifications',
  	"about_heading" varchar DEFAULT 'About the Creator',
  	"cta_heading" varchar DEFAULT 'Ready to Join the Revolution?',
  	"cta_text" varchar,
  	"cta_button_label" varchar DEFAULT 'Back on Kickstarter Now',
  	"cta_button_url" varchar,
  	"cta_price_note" varchar,
  	"footer_line1" varchar DEFAULT '> JetDeck SCOUT © 2026',
  	"footer_line2" varchar DEFAULT 'Built for hackers, makers, and dreamers.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_stats" ADD CONSTRAINT "site_content_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_compute_note_lines" ADD CONSTRAINT "site_content_compute_note_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_what_is_paragraphs" ADD CONSTRAINT "site_content_what_is_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_photo_carousel" ADD CONSTRAINT "site_content_photo_carousel_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_content_photo_carousel" ADD CONSTRAINT "site_content_photo_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_resin_carousel" ADD CONSTRAINT "site_content_resin_carousel_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_content_resin_carousel" ADD CONSTRAINT "site_content_resin_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_spec_tabs_rows" ADD CONSTRAINT "site_content_spec_tabs_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content_spec_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_spec_tabs" ADD CONSTRAINT "site_content_spec_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_pcb_carousel" ADD CONSTRAINT "site_content_pcb_carousel_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_content_pcb_carousel" ADD CONSTRAINT "site_content_pcb_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_about_paragraphs" ADD CONSTRAINT "site_content_about_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content" ADD CONSTRAINT "site_content_hero_animation_id_media_id_fk" FOREIGN KEY ("hero_animation_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
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
  CREATE INDEX "site_content_stats_order_idx" ON "site_content_stats" USING btree ("_order");
  CREATE INDEX "site_content_stats_parent_id_idx" ON "site_content_stats" USING btree ("_parent_id");
  CREATE INDEX "site_content_compute_note_lines_order_idx" ON "site_content_compute_note_lines" USING btree ("_order");
  CREATE INDEX "site_content_compute_note_lines_parent_id_idx" ON "site_content_compute_note_lines" USING btree ("_parent_id");
  CREATE INDEX "site_content_what_is_paragraphs_order_idx" ON "site_content_what_is_paragraphs" USING btree ("_order");
  CREATE INDEX "site_content_what_is_paragraphs_parent_id_idx" ON "site_content_what_is_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "site_content_photo_carousel_order_idx" ON "site_content_photo_carousel" USING btree ("_order");
  CREATE INDEX "site_content_photo_carousel_parent_id_idx" ON "site_content_photo_carousel" USING btree ("_parent_id");
  CREATE INDEX "site_content_photo_carousel_image_idx" ON "site_content_photo_carousel" USING btree ("image_id");
  CREATE INDEX "site_content_resin_carousel_order_idx" ON "site_content_resin_carousel" USING btree ("_order");
  CREATE INDEX "site_content_resin_carousel_parent_id_idx" ON "site_content_resin_carousel" USING btree ("_parent_id");
  CREATE INDEX "site_content_resin_carousel_image_idx" ON "site_content_resin_carousel" USING btree ("image_id");
  CREATE INDEX "site_content_spec_tabs_rows_order_idx" ON "site_content_spec_tabs_rows" USING btree ("_order");
  CREATE INDEX "site_content_spec_tabs_rows_parent_id_idx" ON "site_content_spec_tabs_rows" USING btree ("_parent_id");
  CREATE INDEX "site_content_spec_tabs_order_idx" ON "site_content_spec_tabs" USING btree ("_order");
  CREATE INDEX "site_content_spec_tabs_parent_id_idx" ON "site_content_spec_tabs" USING btree ("_parent_id");
  CREATE INDEX "site_content_pcb_carousel_order_idx" ON "site_content_pcb_carousel" USING btree ("_order");
  CREATE INDEX "site_content_pcb_carousel_parent_id_idx" ON "site_content_pcb_carousel" USING btree ("_parent_id");
  CREATE INDEX "site_content_pcb_carousel_image_idx" ON "site_content_pcb_carousel" USING btree ("image_id");
  CREATE INDEX "site_content_about_paragraphs_order_idx" ON "site_content_about_paragraphs" USING btree ("_order");
  CREATE INDEX "site_content_about_paragraphs_parent_id_idx" ON "site_content_about_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "site_content_hero_animation_idx" ON "site_content" USING btree ("hero_animation_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_content_stats" CASCADE;
  DROP TABLE "site_content_compute_note_lines" CASCADE;
  DROP TABLE "site_content_what_is_paragraphs" CASCADE;
  DROP TABLE "site_content_photo_carousel" CASCADE;
  DROP TABLE "site_content_resin_carousel" CASCADE;
  DROP TABLE "site_content_spec_tabs_rows" CASCADE;
  DROP TABLE "site_content_spec_tabs" CASCADE;
  DROP TABLE "site_content_pcb_carousel" CASCADE;
  DROP TABLE "site_content_about_paragraphs" CASCADE;
  DROP TABLE "site_content" CASCADE;
  DROP TYPE "public"."enum_site_content_stats_icon";
  DROP TYPE "public"."enum_site_content_stats_color";
  DROP TYPE "public"."enum_site_content_compute_note_icon";`)
}
