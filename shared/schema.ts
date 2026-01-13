import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  subjectName: text("subject_name").notNull(),
  lessonType: text("lesson_type").notNull(), // Ma’ruza, Amaliy
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  auditoriumName: text("auditorium_name").notNull(),
  buildingName: text("building_name").notNull(),
  employeeName: text("employee_name").notNull(),
  lessonDate: integer("lesson_date").notNull(), // Unix timestamp in seconds
  groupName: text("group_name").notNull(),
});

export const insertLessonSchema = createInsertSchema(lessons).omit({ id: true });

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
