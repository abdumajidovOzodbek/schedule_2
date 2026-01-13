import { useQuery } from "@tanstack/react-query";
import fallbackData from "./data.json";

export function useLessons() {
  return useQuery({
    queryKey: ["/api/hems/schedule"],
    queryFn: async () => {
      const token =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2MVwvYXV0aFwvbXktaGVtaXMtbG9naW4iLCJhdWQiOiJ2MVwvYXV0aFwvbXktaGVtaXMtbG9naW4iLCJleHAiOjE3Njg5MTk2MjUsImp0aSI6IjUxNjIzMTEwNTAxOCIsInN1YiI6IjUwMzYifQ.T231uZp3pA-iztWPgUTCwkf2XZyM86OWy-ajB2N7k4c";

      try {
        const response = await fetch(
          "https://student.tift.uz/rest/v1/education/schedule?l=uz-UZ&week=13541",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          console.warn(`HEMIS API xatosi: ${response.status}. data.json ishlatiladi.`);
          return fallbackData;
        }

        const json = await response.json();
        console.log("API javobi:", json);

        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          return json.data.map((item: any) => ({
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
        } else {
          console.warn("API javobi bo'sh yoki muvaffaqiyatsiz, data.json ishlatiladi.");
          return fallbackData;
        }
      } catch (error) {
        console.error("API xatosi:", error);
        console.warn("Fallback data.json ishlatiladi.");
        return fallbackData;
      }
    },
  });
}
