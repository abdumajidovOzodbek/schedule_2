import { useQuery } from "@tanstack/react-query";
import fallbackData from "./data.json";

export function useLessons() {
  return useQuery({
    queryKey: ["/api/hems/schedule"],
    queryFn: async () => {
      // Always use data.json as requested for cross-week stability
      return fallbackData.map((item: any) => ({
        id: item.id,
        subjectName: item.subject?.name || "Noma'lum fan",
        lessonType: item.trainingType?.name || "Noma'lum tur",
        startTime: item.lessonPair?.start_time || "00:00",
        endTime: item.lessonPair?.end_time || "00:00",
        auditoriumName: item.auditorium?.name || "Xona noma'lum",
        buildingName: item.auditorium?.building?.name || "Bino noma'lum",
        employeeName: item.employee?.name || "O'qituvchi noma'lum",
        lessonDate: item.lesson_date,
        groupName: item.group?.name || "Guruh noma'lum",
      }));
    },
  });
}
