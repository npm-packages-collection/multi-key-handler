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
      "&%'(".split("").forEach(char => {
        this.#keymap.add(char);
        if (char === "&") this.#keymap.add("up");
        if (char === "'") this.#keymap.add("right");
        if (char === "%") this.#keymap.add("left");
        if (char === "(") this.#keymap.add("down");
      });
    }

    this.#toggleEventListeners(true);
  }

  // Getter for #keymap
  get keymap() {
    return Array.from(this.#keymap).join(""); // Returns keymap as a string
  }

  // Setter for #keymap
  set keymap(keys) {
    if (typeof keys === 'string') {
      this.#keymap = new Set(keys.split(""));
    } else {
      throw new TypeError('Keymap must be a string.');
    }
  }

  /**
   * Toggles event listeners for keydown and keyup events.
   *
   * @param {boolean} shouldBind - Indicates whether to bind or unbind the event listeners.
   */
  #toggleEventListeners(shouldBind = true) {
    const method = shouldBind ? 'addEventListener' : 'removeEventListener';
    ["keydown", "keyup"].forEach(event => {
      window[method](event, this.#handler.bind(this), false);
    });
  }

  /**
   * Handles keyboard events and updates the states accordingly.
   *
   * @param {Event} e - The keyboard event.
   * @returns {void}
   */
  #handler(e) {
    const char = String.fromCharCode(e.keyCode).toLowerCase();

    if (this.#keymap.has(char)) {
      if (char === "&") {
        this.#states["up"] = e.type === "keydown";
      } else if (char === "'") {
        this.#states["right"] = e.type === "keydown";
      } else if (char === "%") {
        this.#states["left"] = e.type === "keydown";
      } else if (char === "(") {
        this.#states["down"] = e.type === "keydown";
      } else {
        this.#states[char] = e.type === "keydown";
      }

      if (typeof this.#cb === 'function') {
        this.#cb(this.#states);
      }

      if (this.#debug) {
        const currentState = JSON.stringify(this.#states);
        if (currentState !== this.#previousState) {
          console.clear();
          console.table(this.#states);
          this.#previousState = currentState;
        }
      }
    }
  }
}
