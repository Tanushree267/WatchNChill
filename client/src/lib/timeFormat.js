// src/lib/timeFormat.js
const timeFormat = (minutes) => {
  if (!minutes && minutes !== 0) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export default timeFormat;