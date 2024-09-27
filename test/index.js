import { expect } from 'chai';
import sinon from 'sinon';
import { JSDOM } from 'jsdom';
import { MultiKeyHandler } from '../index.js';

describe('MultiKeyHandler', () => {
  let handler, callbackSpy, window;

  // Setup the JSDOM environment and the callback spy before each test
  beforeEach(() => {
    const dom = new JSDOM();
    window = dom.window; // Simulating the browser's window object
    global.window = window; // Exposing window globally for the tests

    callbackSpy = sinon.spy(); // Spy on the callback function to monitor how it's invoked
  });

  // Restore Sinon to its default state after each test
  afterEach(() => {
    sinon.restore(); // Cleans up spies, stubs, and mocks
  });

  // Test case 1: Verifying that the keymap is initialized correctly with arrow keys
  it('should initialize with the correct keymap (with arrows)', () => {
    handler = new MultiKeyHandler(callbackSpy, { keys: 'abc', arrows: true, debug: false });

    // These are the expected keys (symbols and arrow keys)
    const expectedSymbols = 'abc&%\'(';
    const expectedArrowNames = ['up', 'left', 'right', 'down'];

    const keymap = handler.keymap;

    // Verify that all symbols are in the keymap
    expectedSymbols.split('').forEach(symbol => {
      expect(keymap.includes(symbol)).to.be.true;
    });

    // Verify that all arrow names are in the keymap
    expectedArrowNames.forEach(arrow => {
      expect(keymap.includes(arrow)).to.be.true;
    });
  });

  // Test case 2: Verifying the keymap is initialized without arrow keys
  it('should initialize with the correct keymap (no arrows)', () => {
    handler = new MultiKeyHandler(callbackSpy, { keys: 'abc', arrows: false, debug: false });

    const expectedKeymap = 'abc'; // Since arrows are disabled, only 'abc' should be in the keymap
    expect(handler.keymap).to.equal(expectedKeymap);
  });

  // Test case 3: Ensure callback is triggered correctly when a key is pressed (with arrows)
  it('should trigger callback when a key is pressed (with arrows)', () => {
    handler = new MultiKeyHandler(callbackSpy, { keys: 'abc', arrows: true, debug: false });

    const event = new window.KeyboardEvent('keydown', { keyCode: 65 }); // 'a' key press
    window.dispatchEvent(event);

    // Verify that the callback was called once and the state was updated for 'a'
    expect(callbackSpy.calledOnce).to.be.true;
    expect(callbackSpy.calledWith({ a: true })).to.be.true;
  });

  // Test case 4: Ensure callback is triggered when a key is pressed without arrows
  it('should trigger callback when a key is pressed (no arrows)', () => {
    handler = new MultiKeyHandler(callbackSpy, { keys: 'xyz', arrows: false, debug: false });

    const event = new window.KeyboardEvent('keydown', { keyCode: 88 }); // 'x' key press
    window.dispatchEvent(event);

    // Verify that the callback was called and the state was updated for 'x'
    expect(callbackSpy.calledOnce).to.be.true;
    expect(callbackSpy.calledWith({ x: true })).to.be.true;
  });

  // Test case 5: Ensure state is cleared on keyup (key release)
  it('should clear state on keyup', () => {
    handler = new MultiKeyHandler(callbackSpy, { keys: 'abc', arrows: true, debug: false });

    const eventDown = new window.KeyboardEvent('keydown', { keyCode: 65 }); // 'a' key down
    const eventUp = new window.KeyboardEvent('keyup', { keyCode: 65 }); // 'a' key up

    window.dispatchEvent(eventDown); // Simulate key down event
    window.dispatchEvent(eventUp); // Simulate key up event

    // Verify that the callback was called with the state cleared for 'a'
    expect(callbackSpy.calledWith({ a: false })).to.be.true;
  });

  // Test case 6: Ensure debug mode logs state changes to the console
  it('should enable debug mode and log state changes', () => {
    handler = new MultiKeyHandler(callbackSpy, { keys: 'abc', arrows: true, debug: true });

    const consoleSpy = sinon.spy(console, 'table'); // Spy on console.table to ensure it's called
    const event = new window.KeyboardEvent('keydown', { keyCode: 65 }); // 'a' key press

    window.dispatchEvent(event);

    // Verify that console.table was called once in debug mode
    expect(consoleSpy.calledOnce).to.be.true;
  });

  // Test case 7: Ensure callback is not triggered for keys not in the keymap
  it('should not trigger callback for keys not in the keymap', () => {
    handler = new MultiKeyHandler(callbackSpy, { keys: 'abc', arrows: false, debug: false });

    const event = new window.KeyboardEvent('keydown', { keyCode: 90 }); // 'z' key press, which is not in the keymap
    window.dispatchEvent(event);

    // Since 'z' is not in the keymap, callback should not be called
    expect(callbackSpy.called).to.be.false;
  });

  // Test case 8: Ensure callback is not triggered for any key when the keymap is empty
  it('should handle empty keymap', () => {
    handler = new MultiKeyHandler(callbackSpy, { keys: '', arrows: false, debug: false });

    const event = new window.KeyboardEvent('keydown', { keyCode: 65 }); // 'a' key press
    window.dispatchEvent(event);

    // Since the keymap is empty, no callback should be triggered for any key
    expect(callbackSpy.called).to.be.false;
  });

  // Test case 9: Ensure error is thrown when trying to set an invalid keymap
  it('should throw an error when invalid keymap is set', () => {
    handler = new MultiKeyHandler(callbackSpy, { keys: 'abc', arrows: true, debug: false });

    // Trying to set the keymap to a non-string value should throw a TypeError
    expect(() => handler.keymap = 123).to.throw(TypeError, 'Keymap must be a string.');
  });
});
