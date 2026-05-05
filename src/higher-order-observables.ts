// Lets create a higher order observable.
import {
  catchError,
  concatAll,
  concatMap,
  delay,
  filter,
  from,
  interval,
  map,
  mergeAll,
  mergeMap,
  Observable,
  of,
  switchMap,
  take,
  tap,
  throwError,
  timer,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import XMLHttpRequest from 'xhr2';

const numberObservable$ = of(1, 2, 3, 4, 5); // emits numbers, so it a normal observable.

const numberHOObservable$ = of(of(1), of(2), of(3), of(4), of(5)); // emits numbers, so it a normal observable.

numberHOObservable$.subscribe((value) => {
  // value is an observable!, to get the actual number it emits, we need
  // to subscribe to it and extract that value.
  const subscription = value.subscribe((innerValue) => console.log(innerValue));
});

// Can we create a higher order observable, using pipe, and a map on numberObservable? Answer is yes
// for each value, we will transform it into a observable that emits that number.
const numberHOObservableUsingPipe$ = numberObservable$.pipe(
  map((value) => of(value)),
);

const numbers = [1, 2, 3, 4];
const transformed = numbers.map((value) => [value]).flat();
const transformed1 = numbers.flatMap((value) => [value]);

console.log(transformed); // [[1], [2], [3], [4]]
console.log(transformed1);

// Lets see few of join operators that help flatten a map that was producing a higher order
// observables.

const numberHOObservableUsingPipe1$ = numberObservable$
  .pipe(
    tap((value) => {
      console.log(value); // Tap completes
      return of(1, 2, 3); // ignored.
    }), // tap is a op factory, that takes a callback in which we
    // can do some side effects.
    map((value) => of(value)), // this operator produces an observable, that emits observable as values.
    tap((previousObs) => {
      console.log('Observalbe:', previousObs);
      console.log('Values after concat All:');
    }),
    concatAll(),
  )
  .subscribe((v) => {
    console.log(v);
  });

const numberHOObservable1$ = of(
  interval(1000).pipe(take(3)), // here take will give you a new observanle which is finite - in this case something similar to : of(0, 1, 2)
  of(2),
  of(3),
  of(4),
  of(5),
);

numberHOObservable1$.pipe(concatAll()).subscribe((value) => console.log(value));

of(1111, 2222)
  .pipe(take(5)) // if input$ produces less values and compltes, take handles it gracefully.
  .subscribe((value) => console.log(value));

// ConcatAll operator is sequential  process first > process second  >

// There is mergeAll, that does subscribe to all incoming observables, and
// then emits values as they arrive.
numberHOObservable1$
  .pipe(
    // can do some side effects.
    //map((value) => of(value)), // this operator produces an observable, that
    mergeAll(),
  )
  .subscribe((v) => {
    console.log(v); // You will observe the interval observable values will appear at the end. You will see the values emitted by non interval observqbnles appearing first. This is due to concurrent nature of mergeAll. You will use merge when you dont care about the order in which the values are arriving.
  });

// Doing a map to produce a higher order observable, and then using concatAll, or mergeAll is extra work. Just like in functional programming, we have flatMap = map + flat,  we have concatMap = map + concatAll , mergeMap = map + mergeAll.

const numberObservable1$ = from([10, 11, 12, 13]);
const numberHOObservableUsingPipe2$ = numberObservable1$
  .pipe(
    // can do some side effects.
    // map((value) => of(value)), // this operator produces an observable, that
    // concatAll(),
    concatMap((value) => of(value)), // Concat map is factory, in the callback it must return an observable value
  )
  .subscribe((v) => {
    console.log('concatMap: ', v);
  });

// mergeMap
const numberHOObservableUsingPipe3$ = numberObservable1$
  .pipe(
    // can do some side effects.
    // map((value) => of(value)), // this operator produces an observable, that
    // concatAll(),
    mergeMap((value) => of(value)), // this is also factory function, and the callback must return an observable
  )
  .subscribe((v) => {
    console.log('concatMap: ', v);
  });

// switchMap  Also a factory similar to mergeMap
/// This operator will be consuming values which are observables, and
// it starts producing values from current observable but immediately unsubscribes from it, should it see the next observable value arrive from its input.

const obs2 = of(3000, 1000, 4000, 2000);
obs2
  .pipe(
    switchMap(
      (
        value, // Try using concatMap and mergeMap, what happens?
      ) =>
        interval(value).pipe(
          take(1),
          map((v) => {
            switch (value) {
              case 1000:
                return 'one thousand';
              case 2000:
                return 'two thousand';
              case 3000:
                return 'three thousand';
              case 4000:
                return 'four thousand';
            }
          }),
        ),
    ),
  )
  .subscribe((value) => {
    console.log('SwitchMap: ', value);
  });

// Values are being produced by inner observabls so fast, that before switchMap can unsubscribe current inner observable and switch to the next, the current observable might have already produced a value. In this cases switchMap might still produce all the values of those fast inner observables.
const obs3 = of(3000, 1000, 4000, 2000);
obs3.pipe(switchMap((value) => of(value))).subscribe((value) => {
  console.log('SwitchMap: ', value);
});

// Creational operator ajax - that does a http request.

const obs$ = ajax({
  url: 'https://jsonplaceholder.typicode.com/users/1',
  createXHR: () => new XMLHttpRequest(),
}).pipe(
  map((httpResponse) => {
    console.log('ajax map called');
    return httpResponse.response;
  }),
  catchError(() => {
    //console.log('error: ', error.message);
    const newError = new Error(
      'The url is invalid, no resource found at this url!',
    );
    // return of({});
    // throw newError;
    return throwError(() => newError);
  }),
);

obs$.subscribe({
  next: (value) => console.log('next called', value),
  error: (err) => console.log('error called', err),
});

// An example of creational operator `ajax` that can return
// you an observable for a HTTP request.

type Geo = {
  lat: string;
  lng: string;
};

type Address = {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
};

type Company = {
  name: string;
  catchPhrase: string;
  bs: string;
};

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
};

// A custom creator operator
function fetchUser(id: number): Observable<User> {
  return ajax({
    url: `https://jsonplaceholder.typicode.com/users/${id}`,
    createXHR: () => new XMLHttpRequest(), // XMLHttpRequest is a Web API, for JS, we need to install the polyfill.
  }).pipe(
    map((httpResponse) => {
      return httpResponse.response as User;
    }),
    catchError(() => {
      //console.log('error: ', error.message);
      const newError = new Error(
        'The url is invalid, no resource found at this url!',
      );
      // return of({});
      // throw newError;
      return throwError(() => newError); // We can catch errors, and can think of either returning a observable that emits a default value in case of error, or returns a new error.
    }),
  );
}

const userIds = [1, 2, 3, 3000];
from(userIds)
  .pipe(
    concatMap((id) => fetchUser(id)),
    catchError((error) => {
      return of({ id: 1000000, name: 'unknown' }); // if error encountered, returning a fake user.
    }),
    filter((user) => user.id !== 1),
    map((user) => user.name),
  )
  .subscribe({
    next(user) {
      console.dir(user); // What should we do, so that we get only user names here?
    },
  });
