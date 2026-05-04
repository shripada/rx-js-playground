import { Observable } from "./observable.js";

function of<T>(...values: T[]): Observable<T> {
  //TODO:
  //create  an observable
  const obsverable = new Observable<T>((observer) => {
    //produce the values receivied from of above
    for (let value of values) {
      //tell observer that a value is available
      observer.next(value);
    }
    // we are done producing values
    observer.complete();
  });
  return obsverable;
}

function from<T>(iterable: Iterable<T>): Observable<T> {
  const obsverable = new Observable<T>((observer) => {
    //produce the values receivied from of above
    for (let value of iterable) {
      //tell observer that a value is available
      observer.next(value);
    }
    // we are done producing values
    observer.complete();
  });
  return obsverable;
}

function range(start: number, count: number): Observable<number> {
  const observable = new Observable((observer) => {
    for (let c = 0; c < count; c++) {
      observer.next(start + c);
    }
    observer.complete();
    //implicitely conveying that there is no cleanup function needed.
  });
  return observable;
}

function interval(millisecs: number): Observable<number> {
  const observable = new Observable((observer) => {
    let count = 0;
    const interval=setInterval(() => {
      //convey the current value of count to observer
      observer.next(count++);
    }, millisecs);
    // now we  are forced to either  return a proper cleanup ,or claim that 
    //there is not cleanup so we can pass return null;
    return ()=>clearInterval(interval);
  });
  return observable;
}



function timer(dueTime: number): Observable<number> {
  // TODO:
}
export { of, from, range, interval, timer };
