const { analyseCode } = require('./feedback');

describe('analyseCode - Feedback Checks', () => {
  test('Detects var usage', () => {
    const code = "var x = 10;";
    const result = analyseCode(code);
    expect(result.feedback).toContain(
      "Consider replacing 'var' with 'let' or 'const' to improve memory management and avoid unintended global variables."
    );
  });

  test('Detects global variable assignment', () => {
    const code = "window.myVar = 'global';";
    const result = analyseCode(code);
    expect(result.feedback).toContain(
      "Avoid using global variables, as they can lead to memory leaks and increased memory consumption."
    );
  });

  test('Detects large loop', () => {
    const code = "for (let i = 0; i < 100; i++) { console.log(i); }";
    const result = analyseCode(code);
    expect(result.feedback).toContain(
      "Optimise loops by reducing unnecessary iterations to decrease CPU cycles and improve energy efficiency."
    );
  });

  test('Detects nested loops', () => {
    const code = "for (let i = 0; i < 5; i++) { for (let j = 0; j < 5; j++) {} }";
    const result = analyseCode(code);
    expect(result.feedback).toContain(
      "Nested loops detected, which may lead to performance bottlenecks. Consider optimising."
    );
  });

  test('Detects setTimeout in loop', () => {
    const code = "for (let i = 0; i < 10; i++) { setTimeout(() => console.log(i), 100); }";
    const result = analyseCode(code);
    expect(result.feedback).toContain(
      "Avoid using synchronous operations like 'setTimeout' inside loops, as they can block execution and consume more energy."
    );
  });

  test('Detects manual nulling for memory cleanup', () => {
    const code = "let temp = {}; temp = null;";
    const result = analyseCode(code);
    expect(result.feedback).toContain(
      "Clean up unused objects or variables to allow garbage collection."
    );
  });

  test('Detects inline event handlers', () => {
    const code = '<button onclick="alert(\'Hi\')">Click me</button>';
    const result = analyseCode(code);
    expect(result.feedback).toContain(
      "Avoid inline event handlers to reduce inefficient DOM manipulation."
    );
  });

  test('Detects setInterval usage', () => {
    const code = "setInterval(() => console.log('tick'), 1000);";
    const result = analyseCode(code);
    expect(result.feedback).toContain(
      "Avoid using 'setInterval' unless necessary. It can result in excessive CPU usage."
    );
  });

  test('Returns positive feedback when no issues found', () => {
    const code = "let x = 5; const y = x * 2; console.log(y);";
    const result = analyseCode(code);
    expect(result.feedback).toContain(
      "Great job! Your code appears efficient and low in emissions."
    );
  });
});
