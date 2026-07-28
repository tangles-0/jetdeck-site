import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" ALTER COLUMN "path" DROP DEFAULT;
  ALTER TABLE "pages" ALTER COLUMN "path" DROP NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" ALTER COLUMN "path" SET DEFAULT '/';
  ALTER TABLE "pages" ALTER COLUMN "path" SET NOT NULL;`)
}
