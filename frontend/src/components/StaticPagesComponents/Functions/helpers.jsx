export const formatNumberWithDots = (number) => {
  return number.toLocaleString('de-DE').replace(/\u00A0/g, ' ');
};
