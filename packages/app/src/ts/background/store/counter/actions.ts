import { Action } from 'redux';

export type CounterActionTypes = 'INCREMENT' | 'DECREMENT';
export type CounterPayload = number;

export type CounterActions = Action<CounterActionTypes, CounterPayload>;

export const increment = (payload: CounterPayload = 1) => ({ type: 'INCREMENT', payload });
export const decrement = (payload: CounterPayload = 1) => ({ type: 'DECREMENT', payload });
