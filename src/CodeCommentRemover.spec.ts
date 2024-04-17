import { CodeCommentRemover } from "./CodeCommentRemover";
import { ICodeWriter } from "./ICodeWriter";

describe('CodeCommentRemover', () => {
  let mockCodeWriter: jest.Mocked<ICodeWriter>;
  let codeRemover: CodeCommentRemover;

  beforeEach(() => {
    mockCodeWriter = { write: jest.fn() };
    codeRemover = new CodeCommentRemover(mockCodeWriter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const normalCodeTestCases = [
    'console.log("Hello, World!");',
    'console.log("Hello,");\nconsole.log("World!");',
    `const x = 10;
    
    function foo(x) {
      return x; 
    }`,
    'const division = (a, b) => a / b;',
    'const multiplication = (a, b) => a * b;'
  ];
  it.each(normalCodeTestCases)('should write normal code directly to codeWriter', (input) => {
    input.split('').forEach(c => codeRemover.trimComment(c));
    const output = mockCodeWriter.write.mock.calls.map(call => call[0]).join('');
    expect(mockCodeWriter.write).toHaveBeenCalledTimes(input.length);
    expect(output).toBe(input);
  });

  const singleLineCommentTestCases = [
    {
      input: 'console.log("Hello, World!");// This is a comment',
      expected: 'console.log("Hello, World!");'
    },
    {
      input: 'console.log("Hello,");// This is a comment\nconsole.log("World!");',
      expected: 'console.log("Hello,");\nconsole.log("World!");'
    },
    {
      input: `// Here you can see a comment
      const x = 10;
    
      // And another one
      function foo(x) {
        // Even inside a function
        return x; 
      }`,
      expected: `
      const x = 10;
    
      
      function foo(x) {
        
        return x; 
      }`
    }
  ];
  it.each(singleLineCommentTestCases)('should remove single line comments', ({input, expected}) => {
    input.split('').forEach(c => codeRemover.trimComment(c));
    const output = mockCodeWriter.write.mock.calls.map(call => call[0]).join('');
    expect(mockCodeWriter.write).toHaveBeenCalledTimes(expected.length);
    expect(output).toBe(expected);
  });

  const multiLineCommentTestCases = [
    {
      input: 'console.log("Hello, World!");/* This is a comment */',
      expected: 'console.log("Hello, World!");'
    },
    {
      input: 'console.log("Hello,");/* This is a comment */\nconsole.log("World!");',
      expected: 'console.log("Hello,");\nconsole.log("World!");'
    },
    {
      input: `/* Here you can see a comment
      const x = 10;
    
      that ends here */
      function foo(x) {/* Even inside a function */
        return x; 
      }`,
      expected: `
      function foo(x) {
        return x; 
      }`
    },
    {
      input: `const x /* type: number */ = 10;`,
      expected: `const x  = 10;`
    },
    {
      input: `const x /* type: number
      and a multiline comment */ = 10;`,
      expected: `const x  = 10;`
    },
    {
      input: 'division = (a, b) => a /* division comment *// b;',
      expected: 'division = (a, b) => a / b;'
    }
  ];
  it.each(multiLineCommentTestCases)('should remove multi line comments', ({input, expected}) => {
    input.split('').forEach(c => codeRemover.trimComment(c));
    const output = mockCodeWriter.write.mock.calls.map(call => call[0]).join('');
    expect(mockCodeWriter.write).toHaveBeenCalledTimes(expected.length);
    expect(output).toBe(expected);
  });

  const mixedCommentTestCases = [
    {
      input: 'console.log("Hello, World!");/* This is a comment */// Another comment',
      expected: 'console.log("Hello, World!");'
    },
    {
      input: 'console.log("Hello,");/* This is a comment */\n// Another comment\nconsole.log("World!");',
      expected: 'console.log("Hello,");\n\nconsole.log("World!");'
    },
    {
      input: `/* This is a comment
      const x = 10;
      // that has a single line comment inside
      and ends here */
      function foo(x) {
        // Even inside a function /* with a multi-line comment */ inside
        return x; 
      }`,
      expected: `
      function foo(x) {
        
        return x; 
      }`
    },
  ]
  it.each(mixedCommentTestCases)('should remove both single and multi line comments', ({input, expected}) => {
    input.split('').forEach(c => codeRemover.trimComment(c));
    const output = mockCodeWriter.write.mock.calls.map(call => call[0]).join('');
    expect(mockCodeWriter.write).toHaveBeenCalledTimes(expected.length);
    expect(output).toBe(expected);
  });
});