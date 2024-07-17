import React from "react";

interface DateConverterProps {
  date: Date;
}

const DateConverter: React.FC<DateConverterProps> = ({ date }) => {
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

  return <span>{formatDate(date)}</span>;
};

export default DateConverter;
