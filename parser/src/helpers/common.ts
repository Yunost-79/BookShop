const arrayFromLength = (number: number) => {
  return Array.from({ length: number }, (_, i) => i + 1);
};

export { arrayFromLength };
