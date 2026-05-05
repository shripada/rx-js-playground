// import { of } from './creational-operators.js';
// import { Observable } from './observable.js';
import { of, Observable } from 'rxjs';

// An operator is a function that takes an observable and returns an observable
export type Operator<T, U> = (input$: Observable<T>) => Observable<U>;

// lets implement an operator `double`

const double: Operator<number, number> = (
  input$: Observable<number>,
): Observable<number> => {
  // create the out put observable. Its executor function
  // must read values of input and double them, and feed them to the observer of output observable.
  // you get a reference to it in the executor function

  const output$ = new Observable<number>((observer) => {
    const inputSubscription = input$.subscribe({
      next(value) {
        if (value !== undefined) {
          observer.next(value * 2);
        }
      },
    });
    return () => {
      inputSubscription.unsubscribe();
    };
  });

  return output$;
};

const square: Operator<number, number> = (
  input$: Observable<number>,
): Observable<number> => {
  // create the out put observable. Its executor function
  // must read values of input and double them, and feed them to the observer of output observable.
  // you get a reference to it in the executor function

  const output$ = new Observable((observer) => {
    const inputSubscription = input$.subscribe({
      next(value) {
        if (value !== undefined) {
          observer.next(value * value);
        }
      },
    });
    return () => {
      inputSubscription.unsubscribe();
    };
  });

  return output$;
};

export const map = function <T, U>(transform: (value: T) => U): Operator<T, U> {
  // must return an operator that takes an input observable as an argument,
  // and then applies the transform function on each value emitted by input observable, and them
  // emits the transformed value to the output observable's observer.
  return (input$: Observable<T>): Observable<U> => {
    // create an output observable. in its executor
    // need to observe the input observable. For each value of input,
    // apply transform, and then emit the result to the output observable's observer.
    const output$ = new Observable((observer) => {
      const inputSubscription = input$.subscribe({
        next(value) {
          if (value) {
            observer.next(transform(value));
          }
        },
      });
      return () => inputSubscription.unsubscribe();
    });

    return output$;
  };
};

const first: Operator<unknown, unknown> = (
  input$: Observable<unknown>,
): Observable<unknown> => {
  // We should subscribe to input, read very first value, and pass it
  // to the observer of the output observable, and immediately unsubscribe from input$
  let isFirstItemSeen = false;
  const output$ = new Observable<unknown>((observer) => {
    const subscription = input$.subscribe({
      next(value: unknown) {
        if (isFirstItemSeen) {
          return;
        } else {
          observer.next(value);
          isFirstItemSeen = true;
        }
        // We need to ensure, we call unsubscribe only in a
        // next event loop cycle. Otherwise, this will be called
        // without a proper value for subscription being assigned.
        // the reason is the values are being produced synchronously.
        setTimeout(() => subscription.unsubscribe(), 0);
      },
    });
    return () => subscription.unsubscribe();
  });

  return output$;
};

// We can actually chain these - compose or pipe

// We can create an observable that doubles and then squares a given observable and gets the first value.

const anObservable$ = of(10, 2, 3, 4, 5);

// const firstSquare$ = first(square(double(anObservable$)));

// firstSquare$.subscribe({
//   next(value) {
//     console.log('From manual pipe: ', value);
//   },
// });

// const firstSquare1$ = anObservable$.pipe(double, square, first);

// const firstSqSubscription = firstSquare1$.subscribe({
//   next(value) {
//     console.log("From observable's pipe: ", value);
//   },
// });

// firstSqSubscription.unsubscribe();

const double1 = map<number, number>((value) => value * 2);
const square1 = map<number, number>((value) => value * value);
const structured = map<number, { value: number }>((value) => ({ value }));

const invalidDoubleSquare = of(10, 11, 12, 13).pipe(
  double1,
  square1,
  structured,
);

const doubleSquare = of(10, 11, 12, 13).pipe(double1, square1, structured);
doubleSquare.subscribe({
  next(value) {
    console.log(value);
  },
});

[{ value: 400 }, { value: 484 }];
