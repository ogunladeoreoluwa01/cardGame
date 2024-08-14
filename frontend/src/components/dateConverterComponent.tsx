import React from "react";

interface DateConverterProps {
  dateString: string;
}

const DateConverter: React.FC<DateConverterProps> = ({ dateString }) => {
  // Parse the date string into a Date object
  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    console.error("Invalid date string:", dateString);
    return <span>Invalid date</span>;
  }

  // Format the date to the desired format: "1st Jan 2024"
  const formatDate = (date: Date): string => {
    const day = date.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    // Determine the day suffix
    let daySuffix;
    if (day === 1 || day === 21 || day === 31) {
      daySuffix = "st";
    } else if (day === 2 || day === 22) {
      daySuffix = "nd";
    } else if (day === 3 || day === 23) {
      daySuffix = "rd";
    } else {
      daySuffix = "th";
    }

    return `${day}${daySuffix} ${month} ${year}`;
  };

  console.log(`Formatted date: ${formatDate(date)}`); // Logging formatted date

  return <span>{formatDate(date)}</span>;
};

export default DateConverter;
