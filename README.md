
# MultiKeyHandler

The `MultiKeyHandler` class allows you to handle multiple key combinations, including arrow keys, with customizable options for debugging and event handling.

## Installation

You can install the package using npm:

```bash
npm install multi-key-handler
```

## Usage

Create an instance of `MultiKeyHandler` and provide a callback function to execute when a key combination is pressed.

### Example

```javascript
import { MultiKeyHandler } from 'multi-key-handler';

const handler = new MultiKeyHandler((states) => {
  console.log('Current key states:', states);
}, {
  keys: 'asdf', // Listen for 'a', 's', 'd', 'f' keys
  arrows: true, // Enable arrow key handling
  debug: true,  // Enable debug mode
});
```

### Callback Function

The callback function receives an object containing the current state of the keys being pressed. Each key's state is either `true` (pressed) or `false` (released).

```javascript
(states) => {
  console.log(states);
  // Example output:
  // {
  //   a: true,
  //   s: false,
  //   d: true,
  //   f: false,
  //   up: false,
  //   down: true
  // }
}
```

## API

### Constructor

```javascript
new MultiKeyHandler(callback, options);
```

- **callback**: A function that will be called whenever a key is pressed or released.
- **options**: An optional object to configure the handler:
  - **keys**: A string of keys to listen for.
  - **arrows**: A boolean indicating if the arrow keys should be included (`true` or `false`).
  - **debug**: A boolean to enable debug mode.

### Methods

#### `keymap` (Getter)

Returns the currently configured keys as a string.

```javascript
console.log(handler.keymap); // 'asdf'
```

#### `keymap` (Setter)

Sets the keys to listen for. The input should be a string.

```javascript
handler.keymap = 'qwer';
```

## Options

| Option  | Type    | Default | Description                          |
|---------|---------|---------|--------------------------------------|
| keys    | string  | ''      | The keys to listen for.              |
| arrows  | boolean | false   | Whether to include arrow keys.       |
| debug   | boolean | false   | Enables debug mode.                  |

## Debug Mode

When debug mode is enabled, a table of the current key states will be printed to the console whenever a change occurs.

```javascript
new MultiKeyHandler((states) => {}, { debug: true });
```

## License

This project is licensed under the MIT License.
