import { CallHandler } from '@nestjs/common';
import { tap, throwError } from 'rxjs';

const SUCCESS_THRESHOLD = 3; // the number of successful operations above which we close the circuit
const FAILURE_THRESHOLD = 3; // the number of failures above which we open the circuit
const OPEN_TO_HALF_OPEN_WAIT_TIME = 60000; // 1 minute in milliseconds

enum CircuitBreakerState {
  Closed,
  Open,
  HalfOpen,
}

export class CircuitBreaker {
  private state = CircuitBreakerState.Closed;
  private failureCount = 0;
  private successCount = 0;
  private lastError: Error;
  private nextAttempt: number;

  exec(next: CallHandler) {
    if (this.state === CircuitBreakerState.Open) {
      if (this.nextAttempt > Date.now()) {
        //  note: the last error is returned as an observable error
        return throwError(() => this.lastError);
      }
      this.state = CircuitBreakerState.HalfOpen;
    }

    //  todo: research on the tap operator
    return next.handle().pipe(
      tap({
        next: () => this.handleSuccess(),
        error: (error) => this.handlerError(error),
      }),
    );
  }

  private handleSuccess() {
    this.failureCount = 0;
    if (this.state === CircuitBreakerState.HalfOpen) {
      this.successCount++;
      if (this.successCount >= SUCCESS_THRESHOLD) {
        this.state = CircuitBreakerState.Closed;
      }
    }
  }

  private handlerError(err: Error) {
    console.log('🦊 error occurred', err.message);
    this.failureCount++;
    if (
      this.failureCount >= FAILURE_THRESHOLD ||
      this.state === CircuitBreakerState.HalfOpen
    ) {
      this.state = CircuitBreakerState.Open;
      this.lastError = err;
      this.nextAttempt = Date.now() + OPEN_TO_HALF_OPEN_WAIT_TIME;
    }
  }
}
