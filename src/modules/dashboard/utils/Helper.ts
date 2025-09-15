// Helper to get the ordinal suffix for any number
function getOrdinalSuffix(num: number): string {
  if (typeof num !== "number" || Number.isNaN(num)) return String(num);

  const j = num % 10;
  const k = num % 100;

  if (k >= 11 && k <= 13) return `${num}th`; // exceptions: 11th, 12th, 13th

  switch (j) {
    case 1:
      return `${num}st`;
    case 2:
      return `${num}nd`;
    case 3:
      return `${num}rd`;
    default:
      return `${num}th`;
  }
}

// Get the weekday name from a Date or string
function getWeekdayName(date: string | Date): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) {
    return "Invalid Date";
  }

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekdays[parsedDate.getDay()];
}

// Calculate nth weekday of the month (e.g., 1st Monday, 3rd Thursday)
function getNthWeekday(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const day = date.getDay(); // 0 = Sunday
  const weekNumber = Math.ceil(date.getDate() / 7); // 1st week = 1, etc.
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return `${getOrdinalSuffix(weekNumber)} ${weekdays[day]}`;
}

export { getOrdinalSuffix, getWeekdayName, getNthWeekday };
