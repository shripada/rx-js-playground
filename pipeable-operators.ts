import { of } from './creational-operators.js';
import { Observable, type Operator } from './observable.js';

function map<T, U>(transform: (value: T) => U): Operator<T, U> {
  return (input: Observable<T>) => {
    const outputObservable = new Observable<U>((subscriber) => {
      const subscription = input.subscribe({
        next(value) {
          try {
            const transformedValue = transform(value);
            subscriber.next(transformedValue);
          } catch (err) {
            subscriber.error(err);
          }
        },
        error(err) {
          subscriber.error(err);
        },
        complete() {
          subscriber.complete();
        },
      });
      return () => subscription.unsubscribe();
    });
    return outputObservable;
  };
}

const numbers$ = of(1, 2, 3, 4, 5);

const squaredNumbers$ = numbers$.pipe(map((x: number) => x * x));

squaredNumbers$.subscribe({
  next(value) {
    console.log('Received value:', value);
  },
  error(err) {
    console.error('Error:', err);
  },
  complete() {
    console.log('Observable completed');
  },
});
