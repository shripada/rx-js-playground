// Observable is a class that represents a stream of data that can be observed and manipulated using various operators. It is a core concept in reactive programming and is used extensively in libraries like RxJS.

export interface Observer<T> {
  next(value: T): void; // Whenever observable emits a new value, the next method is called with that value as an argument.
  error(err: any): void; // If an error occurs during the execution of the observable, the error method is called with the error as an argument.
  complete(): void; // When the observable has finished emitting all values, the complete method is called.
}

export type CleanupFunction = () => void; // A function that is returned by the executor and is responsible for cleaning up resources when the subscription is unsubscribed.

export type Executor<T> = (observer: Observer<T>) => CleanupFunction | void; // A function that takes an observer as an argument and is responsible for emitting values, handling errors, and signaling completion. It can also return a cleanup function that will be called when the subscription is unsubscribed.

export type Subscription = {
  unsubscribe(): void; // A subscription object that allows you to unsubscribe from the observable, stopping it from emitting further values.
};

export class Observable<T> {
  private executor: Executor<T>;

  constructor(executor: Executor<T>) {
    this.executor = executor;
  }

  subscribe(observer: Observer<T>): Subscription {
    const cleanup = this.executor(observer);

    return {
      unsubscribe() {
        // In a real implementation, you would need to handle cleanup logic here to stop the observable from emitting further values.
        if (cleanup) {
          cleanup();
        }
      },
    };
  }
}
