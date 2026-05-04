import { Observable } from './observable.js';

function of<T>(...values: T[]): Observable<T> {
  // create an observable
  const observable = new Observable<T>((observer) => {
    // produce the values received from of above.
    for (let value of values) {
      // tell observer that a value is available
      observer.next(value);
    }
    // we are done producing values
    observer.complete?.();
    return null;
  });

  return observable;
}

function from<T>(iterable: Iterable<T>): Observable<T> {
  const observable = new Observable<T>((observer) => {
    // produce the values received from of above.
    for (let value of iterable) {
      // tell observer that a value is available
      observer.next(value);
    }
    // we are done producing values
    observer.complete?.();
    return null;
  });

  return observable;
}

function range(start: number, count: number): Observable<number> {
  const observable = new Observable((observer) => {
    for (let c = 0; c < count; c++) {
      observer.next(start + c);
    }

    observer.complete?.();

    return null;
  });

  return observable;
}

function interval(millisecs: number): Observable<number> {
  const observable = new Observable((observer) => {
    // create an interval and keep emitting a number incrementally
    let count = 0;

    const interval = setInterval(() => {
      // convey the current value of count to observer
      observer.next(count++);
    }, millisecs);

    return () => clearInterval(interval);
  });

  return observable;
}

function timer(dueTimeMilisecs: number): Observable<number> {
  const observable = new Observable((observer) => {
    const timeout = setTimeout(() => {
      // convey the current value of count to observer
      observer.next();
    }, dueTimeMilisecs);

    return () => clearTimeout(timeout);
  });

  return observable;
}
export { of, from, range, interval, timer };
