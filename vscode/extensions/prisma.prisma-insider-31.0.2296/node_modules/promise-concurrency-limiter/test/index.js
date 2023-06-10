
/* IMPORT */

import {describe} from 'ava-spec';
import {default as Limiter} from '../dist';

/* PROMISE CONCURRENCY LIMITER */

describe ( 'Limiter', it => {

  it ( 'works', async t => {

    let count = 0;

    const increment = () => {
      return new Promise ( resolve => {
        setTimeout ( () => {
          count += 1;
          resolve ();
        }, 1 );
      });
    }

    const limiter = new Limiter ({
      concurrency: 10
    });

    t.is ( limiter.concurrency, 10 );
    t.is ( limiter.count, 0 );
    t.is ( limiter.queue.size, 0 );

    for ( let i = 0, l = 1000; i < l; i++ ) {
      limiter.add ( increment );
    }

    t.is ( limiter.count, 10 );
    t.is ( limiter.queue.size, 990 );
    t.is ( count, 0 );

    return new Promise ( resolve => {

      setTimeout ( () => {

        t.is ( limiter.count, 0 );
        t.is ( limiter.queue.size, 0 );
        t.is ( count, 1000 );

        resolve ();

      }, 2000 );

    });

  });

});
