/**
 * Represents a multi-key handler.
 * @class
 */
export class MultiKeyHandler {
  #states;        // Private instance field
  #cb;            // Private instance field
  #keymap;        // Private instance field
  #debug;         // Private instance field
  #previousState; // Private instance field

  /**
   * Creates a new instance of the MultiKeyHandler class.
   * @param {function} cbfunc - The callback function to be executed when a key combination is pressed.
   * @param {object} options - The options for configuring the MultiKeyHandler.
   * @param {string} options.keys - The keys to listen for as a string.
   * @param {boolean} options.arrows - Indicates whether arrow keys should be included in the key keymapping.
   * @param {boolean} options.debug - Indicates whether debug mode should be enabled.
   */
  constructor(cbfunc, { keys = '', arrows = false, debug = false } = {}) {
    this.#states = {};
    this.#cb = cbfunc;
    this.#keymap = new Set(keys.split(""));
    this.#debug = debug;
    this.#previousState = null;

    if (arrows) {
      const arrowMapping = {
        '&': 'up',
        "'": 'right',
        '%': 'left',
        '(': 'down'
      };

      Object.entries(arrowMapping).forEach(([char, direction]) => {
        this.#keymap.add(char);
        this.#keymap.add(direction);
      });
    }

    this.#toggleEventListeners(true);
  }

  // Getter for #keymap
  get keymap() {
    return Array.from(this.#keymap).join("");
  }

  // Setter for #keymap
  set keymap(keys) {
    if (typeof keys !== 'string') {
      throw new TypeError('Keymap must be a string.');
    }
    this.#keymap = new Set(keys.split(""));
  }

  /**
   * Toggles event listeners for keydown and keyup events.
   * @param {boolean} shouldBind - Indicates whether to bind or unbind the event listeners.
   * @private
   */
  #toggleEventListeners(shouldBind = true) {
    const method = shouldBind ? 'addEventListener' : 'removeEventListener';
    const boundHandler = this.#handler.bind(this);
    ["keydown", "keyup"].forEach(event => {
      window[method](event, boundHandler, false);
    });
  }

  /**
   * Updates the debug display if debug mode is enabled.
   * @private
   */
  #updateDebugDisplay() {
    if (!this.#debug) return;

    const currentState = JSON.stringify(this.#states);
    if (currentState !== this.#previousState) {
      console.clear();
      console.table(this.#states);
      this.#previousState = currentState;
    }
  }

  /**
   * Handles keyboard events and updates the states accordingly.
   * @param {KeyboardEvent} e - The keyboard event.
   * @private
   */
  #handler(e) {
    const char = String.fromCharCode(e.keyCode).toLowerCase();
    const isKeyDown = e.type === "keydown";

    // Check if the key is in our keymap
    if (!this.#keymap.has(char)) return;

    // Update states based on arrow keys
    const arrowMapping = {
      '&': 'up',
      "'": 'right',
      '%': 'left',
      '(': 'down'
    };

    const key = arrowMapping[char] || char;
    this.#states[key] = isKeyDown;

    // Call the callback if it exists
    if (typeof this.#cb === 'function') {
      this.#cb(this.#states);
    }

    this.#updateDebugDisplay();
  }

  /**
   * Cleans up event listeners when the handler is no longer needed.
   */
  destroy() {
    this.#toggleEventListeners(false);
    this.#states = {};
    this.#previousState = null;
  }
}