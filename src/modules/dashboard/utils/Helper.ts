// Calculate nth weekday of the month
function getNthWeekday(date: Date) {
  const day = date.getDay(); // 0 = Sunday
  const weekNumber = Math.ceil(date.getDate() / 7);
  const weekdayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return `${weekNumber}th ${weekdayNames[day]}`;
}

// Get weekday name from date
function getWeekdayName(date: string | Date) {
  const parsedDate =
    typeof date === "string" ? new Date(date) : new Date(date as Date);

  if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) {
    return "Invalid Date";
  }

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[parsedDate.getDay()];
}

function getOrdinalSuffix(num: number): string {
  const j = num % 10,
    k = num % 100;
  if (j === 1 && k !== 11) return `${num}st`;
  if (j === 2 && k !== 12) return `${num}nd`;
  if (j === 3 && k !== 13) return `${num}rd`;
  return `${num}th`;
}

export { getNthWeekday, getWeekdayName, getOrdinalSuffix };
