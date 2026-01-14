import { Lesson } from "@shared/schema";
import { cn } from "@/lib/utils";
import { MapPin, User, Clock, BookOpen, Timer } from "lucide-react";
import { useState, useEffect } from "react";
import { parse, isWithinInterval, isBefore, isAfter, differenceInMinutes, format } from "date-fns";

interface LessonCardProps {
  lesson: Lesson;
}

export function LessonCard({ lesson }: LessonCardProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const isLecture = lesson.lessonType.toLowerCase().includes("ma'ruza");
  
  // Parse times for today to check status
  const today = format(now, "yyyy-MM-dd");
  const lessonDate = format(new Date(lesson.lessonDate * 1000), "yyyy-MM-dd");
  const isToday = today === lessonDate;

  let status: "past" | "current" | "future" = "future";
  let timeLeft = "";
  let progress = 0;

  if (isToday) {
    // Force current date to ensure parse uses correct day context
    const start = parse(lesson.startTime, "HH:mm", now);
    const end = parse(lesson.endTime, "HH:mm", now);

    // Add a small buffer (e.g., 1 minute) to account for slight clock drift
    const isNow = isWithinInterval(now, { start, end });

    if (isNow) {
      status = "current";
      const totalMinutes = differenceInMinutes(end, start);
      const passedMinutes = differenceInMinutes(now, start);
      progress = Math.min(100, Math.max(0, (passedMinutes / totalMinutes) * 100));
      timeLeft = `${differenceInMinutes(end, now)} min qoldi`;
    } else if (isAfter(now, end)) {
      status = "past";
    } else if (isBefore(now, start)) {
      status = "future";
      const minutesUntil = differenceInMinutes(start, now);
      if (minutesUntil < 60) {
        timeLeft = `${minutesUntil} min keyin`;
      }
    }
  }

  // Use primary color for lectures, secondary for practice
  const accentColor = status === "current" 
    ? "bg-emerald-500" 
    : isLecture ? "bg-primary" : "bg-blue-500";
    
  const badgeColor = isLecture 
    ? "bg-primary/10 text-primary border-primary/20" 
    : "bg-blue-500/10 text-blue-600 border-blue-500/20";

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-sm transition-all duration-300 hover:shadow-md hover:border-border/80 hover:-translate-y-0.5",
      status === "past" && "opacity-60 grayscale-[0.3]",
      status === "current" && "ring-2 ring-emerald-500/20 border-emerald-500/30"
    )}>
      {/* Colored accent bar on the left */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-500", accentColor)} />

      <div className="p-5 pl-7 flex flex-col gap-4">
        {/* Header: Subject & Type */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {lesson.subjectName}
            </h3>
            {status === "current" && (
              <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold animate-pulse">
                <Timer className="w-3 h-3" />
                HOZIR DAVOM ETMОQDA
              </div>
            )}
          </div>
          <span className={cn(
            "shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap",
            badgeColor
          )}>
            {lesson.lessonType}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-muted/50">
              <Clock className="w-4 h-4 text-primary/70" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-foreground/90">
                {lesson.startTime} — {lesson.endTime}
              </span>
              {timeLeft && (
                <span className="text-[10px] font-medium text-primary/80 uppercase tracking-wider">
                  {timeLeft}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-muted/50">
              <MapPin className="w-4 h-4 text-primary/70" />
            </div>
            <span className="truncate font-medium">
              {lesson.auditoriumName} • {lesson.buildingName}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:col-span-2">
            <div className="p-1.5 rounded-lg bg-muted/50">
              <User className="w-4 h-4 text-primary/70" />
            </div>
            <span className="truncate font-medium">{lesson.employeeName}</span>
          </div>
        </div>

        {/* Progress bar for current lesson */}
        {status === "current" && (
          <div className="mt-1 space-y-1.5">
            <div className="h-1.5 w-full bg-emerald-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
