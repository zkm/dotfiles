# Promise Concurrency Limiter

Tiny scheduler for functions returning promises that can limit their concurrency.

## Install

```sh
npm install --save promise-concurrency-limiter
```

## Usage

```ts
import Limiter from 'promise-concurrency-limiter';

const limiter = new Limiter ({
  concurrency: 2 // Limit the number of simultaneously active promises to 2
});

const somePromiseReturningFunction = async () => { /* ... */ };

limiter.add ( somePromiseReturningFunction ); // First function added, executed immediately
limiter.add ( somePromiseReturningFunction ); // Second function added, executed immediately
limiter.add ( somePromiseReturningFunction ); // Third function added, executed immediately only if one of the 2 available slots got freed, deferred otherwise
```

## License

MIT © Fabio Spampinato
