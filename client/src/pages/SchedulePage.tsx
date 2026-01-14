import { useLessons } from "@/hooks/use-lessons";
import { LessonCard } from "@/components/schedule/LessonCard";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Calendar, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { isSameDay, startOfDay, format, addDays, subDays } from "date-fns";
import { uz } from "date-fns/locale";

export default function SchedulePage() {
  const { data: lessons, isLoading } = useLessons();
  const [currentDate, setCurrentDate] = useState(startOfDay(new Date()));

  // Process and group lessons
  const allGroupedLessons = useMemo(() => {
    if (!lessons || !Array.isArray(lessons)) return new Map<string, any[]>();

    const processed = lessons.map(l => ({
      ...l,
      lessonDate: typeof l.lessonDate === 'number' ? l.lessonDate : 0
    })).filter(l => l.lessonDate > 0);
    
    const groups = new Map<string, any[]>();
    processed.forEach((lesson) => {
      const dateKey = startOfDay(new Date(lesson.lessonDate * 1000)).toISOString();
      if (!groups.has(dateKey)) groups.set(dateKey, []);
      groups.get(dateKey)!.push(lesson);
    });

    return groups;
  }, [lessons]);

  // If today has no lessons, find the first available date
  useEffect(() => {
    if (allGroupedLessons.size > 0 && !allGroupedLessons.has(currentDate.toISOString())) {
      const sortedDates = Array.from(allGroupedLessons.keys()).sort();
      setCurrentDate(new Date(sortedDates[0]));
    }
  }, [allGroupedLessons]);

  const groupName = useMemo(() => {
    if (lessons?.[0]) return lessons[0].groupName || "Guruh";
    return "Guruh";
  }, [lessons]);

  const currentLessons = allGroupedLessons.get(currentDate.toISOString()) || [];
  const sortedDates = Array.from(allGroupedLessons.keys()).sort();
  const currentIndex = sortedDates.indexOf(currentDate.toISOString());

  const goToPrevDay = () => {
    if (currentIndex > 0) setCurrentDate(new Date(sortedDates[currentIndex - 1]));
    else setCurrentDate(subDays(currentDate, 1));
  };
  
  const goToNextDay = () => {
    if (currentIndex < sortedDates.length - 1 && currentIndex !== -1) 
      setCurrentDate(new Date(sortedDates[currentIndex + 1]));
    else setCurrentDate(addDays(currentDate, 1));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4 text-primary">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="font-medium animate-pulse text-slate-500">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans">
      <main className="max-w-2xl mx-auto px-2 sm:px-4 pt-4 sm:pt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl sm:rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/50 overflow-hidden"
        >
          {/* Modern Header */}
          <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight">
                Dars jadvali
              </h1>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button 
                  onClick={goToPrevDay}
                  className="p-2 sm:p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <button 
                  onClick={goToNextDay}
                  className="p-2 sm:p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
                >
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-semibold uppercase tracking-wider text-[10px] sm:text-xs">
              <span className="text-slate-600">{format(currentDate, "d MMMM", { locale: uz })}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>{format(currentDate, "EEEE", { locale: uz })}</span>
            </div>
          </div>

          {/* Lesson List */}
          <div className="px-3 sm:px-6 pb-6 sm:pb-8">
            <AnimatePresence mode="wait">
              {currentLessons.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-16 text-center"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-medium">Bu kunda darslar yo'q</p>
                </motion.div>
              ) : (
                <motion.div 
                  key={currentDate.toISOString()}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {currentLessons.map((lesson) => (
                    <LessonCard key={lesson.id} lesson={lesson} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer Info */}
        <div className="text-center mt-8 space-y-1">
          <p className="text-slate-400 text-[10px] font-bold tracking-[0.2em] uppercase">
            {groupName} • TIFT UNIVERSITY
          </p>
        </div>
      </main>
    </div>
  );
}
