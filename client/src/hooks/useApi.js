import { useCallback, useRef, useState } from 'react';

export function useApi(initialState = null) {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const run = useCallback(async (promiseFactory) => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    try {
      // promiseFactory should be a function returning axios promise accepting signal
      const result = await promiseFactory(controller.signal);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
      setLoading(false);
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(initialState);
    setError(null);
    setLoading(false);
  }, [initialState]);

  return { data, loading, error, run, cancel, reset };
}

export default useApi;