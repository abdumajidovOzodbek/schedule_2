import { format } from "date-fns";
import { uz } from "date-fns/locale";
import { CalendarDays } from "lucide-react";

interface DateHeaderProps {
  date: Date;
}

export function DateHeader({ date }: DateHeaderProps) {
  // Format: "Dushanba, 14-Oktyabr"
  const weekday = format(date, "EEEE", { locale: uz });
  const dayMonth = format(date, "d-MMMM", { locale: uz });

  // Capitalize first letter of weekday
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-4 mb-4 border-b border-border/40">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/5 text-primary">
          <CalendarDays className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground font-display">
            {capitalizedWeekday}
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            {dayMonth}
          </p>
        </div>
      </div>
    </div>
  );
}
