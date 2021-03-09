import { useDispatch as rUseDispatch } from 'react-redux';

/**
 * In the extension, all dispatch calls are asynchronous.
 * This is a wrapper hook to get an async-typed dispatch.
 */
export const useDispatch = () => {
  const dispatch = rUseDispatch();
  const asyncDispatch = async (action: any) => {
    return Promise.resolve(dispatch(action));
  };

  return asyncDispatch;
};
