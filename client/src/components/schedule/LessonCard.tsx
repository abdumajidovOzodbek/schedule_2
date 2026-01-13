import { Lesson } from "@shared/schema";
import { cn } from "@/lib/utils";
import { MapPin, User, Clock, BookOpen } from "lucide-react";

interface LessonCardProps {
  lesson: Lesson;
}

export function LessonCard({ lesson }: LessonCardProps) {
  const isLecture = lesson.lessonType.toLowerCase().includes("ma'ruza");
  
  // Use primary color for lectures, secondary for practice
  const accentColor = isLecture ? "bg-primary" : "bg-secondary";
  const badgeColor = isLecture 
    ? "bg-primary/10 text-primary border-primary/20" 
    : "bg-secondary/10 text-secondary border-secondary/20";

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-sm transition-all duration-300 hover:shadow-md hover:border-border hover:-translate-y-0.5">
      {/* Colored accent bar on the left */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", accentColor)} />

      <div className="p-5 pl-7 flex flex-col gap-4">
        {/* Header: Subject & Type */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display font-bold text-lg leading-tight text-foreground line-clamp-2">
            {lesson.subjectName}
          </h3>
          <span className={cn(
            "shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold border",
            badgeColor
          )}>
            {lesson.lessonType}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary/70" />
            <span className="font-medium text-foreground/80">
              {lesson.startTime} — {lesson.endTime}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary/70" />
            <span className="truncate">
              {lesson.auditoriumName} • {lesson.buildingName}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:col-span-2">
            <User className="w-4 h-4 text-primary/70" />
            <span className="truncate">{lesson.employeeName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
