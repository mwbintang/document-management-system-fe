import { useCallback, useRef } from "react";

export const useDebounceFn = (fn: (...args: any[]) => void, delay: number) => {
  const timer = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: any[]) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay]
  );
};