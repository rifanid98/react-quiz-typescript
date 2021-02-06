export const shuffleArray = (array: any[]) => {
  return [...array].sort(_ => Math.random() - 0.5);
}