export const isDateInPast = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    // Reset time portion of both dates to midnight
  date.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
    return date < now;
};

export const isDateInFuture = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    // Reset time portion of both dates to midnight
  date.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
    return date >= now;
};

export const isDateToday = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    // Reset time portion of both dates to midnight
    date.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    return date.toDateString() === now.toDateString();
};

export const isDateTomorrow = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
};

export const isDateSoon = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return date > tomorrow;
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
    return formattedDate;
};
