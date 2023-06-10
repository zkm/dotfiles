# Are Shallow Equal

Check if two values are shallowly equal to each other.

## Install

```sh
npm install --save are-shallow-equal
```

## Usage

```ts
import areShallowEqual from 'are-shallow-equal';

areShallowEqual ( 123, 123 ); // true
areShallowEqual ( { foo: 1 }, { foo: 1 } ); // true
areShallowEqual ( [1, 2, 3], [1, 2, 3] ); // true
```

## License

MIT © Fabio Spampinato
