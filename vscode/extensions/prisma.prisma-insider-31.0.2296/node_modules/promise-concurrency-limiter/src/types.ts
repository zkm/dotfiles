
/* TYPES */

type Callback = () => void;

type Task<T> = () => Promise<T>;

type Options = {
  concurrency: number
};

/* EXPORT */

export {Callback, Task, Options};
