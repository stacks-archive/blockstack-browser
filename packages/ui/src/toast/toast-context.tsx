import React, { useContext, createContext, useReducer, useCallback } from 'react';

import { Portal } from '../portal';
import { Toaster } from './toaster';

import { ToastType, AddToast, ToastState, ToastProviderProps } from './types';

let toastCounter = 0;

const ToastControllerContext = createContext<AddToast | null>(null);

const QUEUE_TOAST = 0;
const REMOVE_TOAST = 1;

type Actions =
  | { type: typeof QUEUE_TOAST; payload: ToastType }
  | { type: typeof REMOVE_TOAST; payload: string };

function reducer(state: ToastState, action: Actions): ToastState {
  switch (action.type) {
    case QUEUE_TOAST: {
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };
    }

    case REMOVE_TOAST: {
      const toasts = state.toasts.filter(({ id }) => id !== action.payload);

      return {
        ...state,
        toasts,
      };
    }
  }

  return state;
}

const InternalToastProvider = ({ children }: ToastProviderProps) => {
  const [{ toasts }, dispatch] = useReducer(reducer, {
    toasts: [],
  });

  const addToast = useCallback(
    (props: ToastType) => dispatch({ type: QUEUE_TOAST, payload: props }),
    []
  );

  const removeToast = useCallback(
    (id: string) => dispatch({ type: REMOVE_TOAST, payload: id }),
    []
  );

  return (
    <ToastControllerContext.Provider value={addToast}>
      {children}
      <Portal>
        <Toaster toasts={toasts} removeToast={removeToast} />
      </Portal>
    </ToastControllerContext.Provider>
  );
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const currentContext = useContext(ToastControllerContext);

  if (currentContext !== null) {
    // Bail early as "ToastProvider" is already setup
    return <>{children}</>;
  }

  return <InternalToastProvider>{children}</InternalToastProvider>;
};

export const useToast = () => {
  const addToast = useContext(ToastControllerContext);

  if (addToast === null) {
    throw new Error('No "ToastProvider" configured');
  }

  return useCallback(
    (props: Omit<ToastType, 'id'>) => addToast({ ...props, id: `${toastCounter++}` }),
    [addToast]
  );
};
