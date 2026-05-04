import { Observable } from './observable.js';

function of<T>(...values: T[]): Observable<T> {
  //TODO:
}

function from<T>(iterable: Iterable<T>): Observable<T> {
  // TODO:
}

function range(start: number, count: number): Observable<number> {
  // TODO:
}

function interval(period: number): Observable<number> {
  // TODO:
}

function timer(dueTime: number): Observable<number> {
  // TODO:
}
export { of, from, range, interval, timer };
