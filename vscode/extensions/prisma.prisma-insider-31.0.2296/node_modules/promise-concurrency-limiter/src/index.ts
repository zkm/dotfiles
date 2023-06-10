
/* IMPORT */

import {Callback, Options, Task} from './types';

/* PROMISE CONCURRENCY LIMITER */

class Limiter {

  /* VARIABLES */

  concurrency: number;
  count: number;
  queue: Set<Callback>;

  /* CONSTRUCTOR */

  constructor ( options: Options ) {

    this.concurrency = options.concurrency;
    this.count = 0;
    this.queue = new Set ();

  }

  /* API */

  add <T> ( fn: Task<T> ): Promise<T> {

    if ( this.count < this.concurrency ) return this.run ( fn );

    return new Promise<T> ( resolve => {

      const callback = () => resolve ( this.run ( fn ) );

      this.queue.add ( callback );

    });

  }

  flush (): void {

    for ( const callback of this.queue ) {

      if ( this.count >= this.concurrency ) break;

      this.queue.delete ( callback );

      callback ();

    }

  }

  run <T> ( fn: Task<T> ): Promise<T> {

    this.count += 1;

    const promise = fn ();

    const cleanup = (): void => {

      this.count -= 1;

      this.flush ();

    };

    promise.then ( cleanup, cleanup );

    return promise;

  }

}

export default Limiter;
