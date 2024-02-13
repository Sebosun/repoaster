export const timeout = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Promise<void>);
    }, time);
  });
};
