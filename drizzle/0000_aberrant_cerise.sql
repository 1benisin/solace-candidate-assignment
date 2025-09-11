CREATE TABLE "advocates" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"city" text NOT NULL,
	"degree" text NOT NULL,
	"specialties" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"years_of_experience" integer NOT NULL,
	"phone_number" bigint NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX "first_name_idx" ON "advocates" USING btree ("first_name");--> statement-breakpoint
CREATE INDEX "last_name_idx" ON "advocates" USING btree ("last_name");--> statement-breakpoint
CREATE INDEX "city_idx" ON "advocates" USING btree ("city");--> statement-breakpoint
CREATE INDEX "degree_idx" ON "advocates" USING btree ("degree");--> statement-breakpoint
CREATE INDEX "experience_idx" ON "advocates" USING btree ("years_of_experience");--> statement-breakpoint
CREATE INDEX "name_search_idx" ON "advocates" USING btree ("first_name","last_name");--> statement-breakpoint
CREATE INDEX "specialties_gin_idx" ON "advocates" USING gin ("specialties");--> statement-breakpoint
CREATE INDEX "experience_range_idx" ON "advocates" USING btree ("years_of_experience") WHERE "advocates"."years_of_experience" > 0;