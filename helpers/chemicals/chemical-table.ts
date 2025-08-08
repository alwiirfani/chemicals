export const isExpired = (date: Date | null) => {
  if (!date) return false;
  return new Date() > date;
};

export const isExpiringSoon = (date: Date | null) => {
  if (!date) return false;
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  return date <= thirtyDaysFromNow && date > new Date();
};
