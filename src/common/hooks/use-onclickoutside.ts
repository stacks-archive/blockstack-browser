import React, { useEffect } from 'react';
import arePassiveEventsSupported from 'are-passive-events-supported';
import useLatest from 'use-latest';

const MOUSEDOWN = 'mousedown';
const TOUCHSTART = 'touchstart';
const isBrowser = typeof document !== 'undefined';

type HandledEvents = [typeof MOUSEDOWN, typeof TOUCHSTART];
type HandledEventsType = HandledEvents[number];
type PossibleEvent = {
  [Type in HandledEventsType]: HTMLElementEventMap[Type];
}[HandledEventsType];
type Handler = (event: PossibleEvent) => void;

const events: HandledEvents = [MOUSEDOWN, TOUCHSTART];

const getOptions = (event: HandledEventsType) => {
  if (event !== TOUCHSTART) {
    return;
  }

  if (arePassiveEventsSupported()) {
    return { passive: true };
  }

  return;
};

export default function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: Handler | null
) {
  if (!isBrowser) {
    return;
  }

  const noHandler = !handler;
  const handlerRef = useLatest(handler);

  useEffect(() => {
    if (noHandler) {
      return;
    }

    const listener = (event: PossibleEvent) => {
      if (!ref.current || !handlerRef.current || ref.current.contains(event.target as Node)) {
        return;
      }

      handlerRef.current(event);
    };

    events.forEach(event => {
      document.addEventListener(event, listener, getOptions(event));
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, listener, getOptions(event) as EventListenerOptions);
      });
    };
  }, [ref, handlerRef, noHandler]);
}
