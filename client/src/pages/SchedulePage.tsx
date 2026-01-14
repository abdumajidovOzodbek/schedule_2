import { useLessons } from "@/hooks/use-lessons";
import { LessonCard } from "@/components/schedule/LessonCard";
import { DateHeader } from "@/components/schedule/DateHeader";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, GraduationCap, Calendar, BookOpen } from "lucide-react";
import { isSameDay, startOfDay, format } from "date-fns";
import { uz } from "date-fns/locale";

export default function SchedulePage() {
  const { data: lessons, isLoading, error } = useLessons();
  const [activeTab, setActiveTab] = useState<"weekly" | "daily">("weekly");

  // Process and group lessons
  const groupedLessons = useMemo(() => {
    if (!lessons || !Array.isArray(lessons)) return [];

    // Helper function to extract lesson fields from raw or mapped data
    const mapLesson = (l: any) => {
      // If it's already mapped
      if (l.subjectName) return l;
      
      // If it's raw data from HEMIS
      return {
        id: l.id,
        subjectName: l.subject?.name || "Noma'lum fan",
        lessonType: l.trainingType?.name || "Noma'lum tur",
        startTime: l.lessonPair?.start_time || "00:00",
        endTime: l.lessonPair?.end_time || "00:00",
        auditoriumName: l.auditorium?.name || "Xona noma'lum",
        buildingName: l.auditorium?.building?.name || "Bino noma'lum",
        employeeName: l.employee?.name || "O'qituvchi noma'lum",
        lessonDate: l.lesson_date,
        groupName: l.group?.name || "Guruh noma'lum",
      };
    };

    const processedLessons = lessons.map(mapLesson).filter(l => l && typeof l.lessonDate === 'number');

    // Sort all lessons by date and start time
    const sorted = [...processedLessons].sort((a, b) => {
      if (a.lessonDate !== b.lessonDate) return a.lessonDate - b.lessonDate;
      return (a.startTime || "").localeCompare(b.startTime || "");
    });

    // Group by unique date timestamp
    const groups = new Map<number, any[]>();
    
    sorted.forEach((lesson) => {
      const dateKey = lesson.lessonDate;
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push(lesson);
    });

    return Array.from(groups.entries()).map(([dateSecs, items]) => ({
      date: new Date(dateSecs * 1000),
      items,
    })).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [lessons]);

  // Determine Group Name
  const groupName = useMemo(() => {
    if (lessons && Array.isArray(lessons) && lessons.length > 0) {
      const first = lessons[0];
      return first.groupName || first.group?.name || "Guruh";
    }
    return "Guruh";
  }, [lessons]);

  // Filter for Daily view (Today)
  const dailyLessons = useMemo(() => {
    const today = startOfDay(new Date());
    return groupedLessons.filter((group) => isSameDay(group.date, today));
  }, [groupedLessons]);

  const displayedGroups = activeTab === "weekly" ? groupedLessons : dailyLessons;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-primary">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="font-medium animate-pulse">Jadval yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  const isEmpty = displayedGroups.length === 0;

  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="bg-white border-b border-border/60 sticky top-0 z-30 backdrop-blur-xl bg-white/80">
        <div className="max-w-2xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 md:h-12 md:w-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                <GraduationCap className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground font-display tracking-tight">
                  Dars Jadvali
                </h1>
                <p className="text-sm text-muted-foreground font-medium">
                  {groupName}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex space-x-1 p-1 bg-muted/50 rounded-xl w-full sm:w-auto self-start">
              <button
                onClick={() => setActiveTab("weekly")}
                className={cn(
                  "flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  activeTab === "weekly"
                    ? "bg-white text-primary shadow-sm ring-1 ring-black/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                )}
              >
                Haftalik
              </button>
              <button
                onClick={() => setActiveTab("daily")}
                className={cn(
                  "flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  activeTab === "daily"
                    ? "bg-white text-primary shadow-sm ring-1 ring-black/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                )}
              >
                Kunlik
              </button>
            </div>
            
            {activeTab === "weekly" && (
              <div className="hidden sm:flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {groupedLessons.map((group) => (
                  <button
                    key={group.date.toISOString()}
                    onClick={() => {
                      const element = document.getElementById(`date-${group.date.toISOString()}`);
                      if (element) {
                        const headerOffset = 180;
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                      }
                    }}
                    className="shrink-0 w-10 h-10 rounded-full flex flex-col items-center justify-center border border-border/50 bg-white hover:border-primary hover:text-primary transition-all text-[10px] font-bold"
                  >
                    <span className="opacity-60">{format(group.date, "EEE", { locale: uz }).toUpperCase()}</span>
                    <span>{format(group.date, "d")}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {isEmpty ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Darslar yo'q</h3>
              <p className="text-muted-foreground mt-1">
                {activeTab === "daily" 
                  ? "Bugun uchun hech qanday dars topilmadi." 
                  : "Hozircha jadval bo'sh."}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {displayedGroups.map((group, groupIndex) => (
                <motion.div
                  key={group.date.toISOString()}
                  id={`date-${group.date.toISOString()}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.05 }}
                >
                  <DateHeader date={group.date} />
                  <div className="space-y-4">
                    {group.items.map((lesson) => (
                      <LessonCard key={lesson.id} lesson={lesson} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
