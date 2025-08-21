export const paramsMap: Record<'7days' | '30days' | '90days' | 'custom', () => { startDateUTC: string; endDateUTC: string }> = {
  '7days': () => {
    const currentDate = new Date();
    const kolkataOffset = 5.5 * 60 * 60 * 1000; 
    const currentDateKolkata = new Date(currentDate.getTime() - kolkataOffset);

    const startDate = new Date(currentDateKolkata);
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0); // Start of the 30 days

    const endDate = new Date(currentDateKolkata);
    endDate.setHours(23, 30, 0, 0); // End of the current day

    const startDateUTC = startDate.toISOString();
    const endDateUTC = endDate.toISOString();
    return { startDateUTC, endDateUTC };
  },

  '30days': () => {
    const currentDate = new Date();
    const kolkataOffset = 5.5 * 60 * 60 * 1000; 
    const currentDateKolkata = new Date(currentDate.getTime() - kolkataOffset);

    const startDate = new Date(currentDateKolkata);
    startDate.setDate(startDate.getDate() - 30);
    startDate.setHours(0, 0, 0, 0); // Start of the 30 days

    const endDate = new Date(currentDateKolkata);
    endDate.setHours(23, 30, 0, 0); // End of the current day

    const startDateUTC = startDate.toISOString();
    const endDateUTC = endDate.toISOString();

    return { startDateUTC, endDateUTC };
  },

  '90days': () => {
    const currentDate = new Date();
    const kolkataOffset = 5.5 * 60 * 60 * 1000; 
    const currentDateKolkata = new Date(currentDate.getTime() - kolkataOffset);

    const startDate = new Date(currentDateKolkata);
    startDate.setDate(startDate.getDate() - 90);
    startDate.setHours(0, 0, 0, 0); // Start of the 90 days

    const endDate = new Date(currentDateKolkata);
    endDate.setHours(23, 30, 0, 0); // End of the current day

    const startDateUTC = startDate.toISOString();
    const endDateUTC = endDate.toISOString();

    return { startDateUTC, endDateUTC };
  },
  'custom': () => {
    return { startDateUTC: '', endDateUTC :'' };
  } 
};

export const convertToUTC = (start: string, end: string) => {
  const kolkataOffset = 5.5 * 60 * 60 * 1000;

  // Parse the start and end dates
  const startDateLocal = new Date(`${start}T00:00:00`); // Local time at 12:00 AM
  const endDateLocal = new Date(`${end}T23:59:59`); // Local time at 11:59 PM

  // Add 1 day to the end date
  endDateLocal.setDate(endDateLocal.getDate() + 1);

  // Convert to UTC by subtracting the Kolkata offset
  const startDateUTC = new Date(startDateLocal.getTime() - kolkataOffset).toISOString();
  const endDateUTC = new Date(endDateLocal.getTime() - kolkataOffset).toISOString();

  return { startDateUTC, endDateUTC };
};