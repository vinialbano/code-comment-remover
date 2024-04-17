# CodeCommentRemover

CodeCommentRemover is a utility designed to remove both single-line (`//`) and multi-line (`/* */`) comments from TypeScript/JavaScript code. It's ideal for cleaning up code before deployment or integration into other systems.

## Features

- Removes single-line and multi-line comments.
- Customizable output via the `ICodeWriter` interface.

## Usage

### Implement the ICodeWriter Interface

Create a custom code writer to handle output:

```typescript
// MyCodeWriter.ts
import { ICodeWriter } from './ICodeWriter';

export class MyCodeWriter implements ICodeWriter {
    private result: string = "";

    write(char: string): void {
        this.result += char;
    }

    getResult(): string {
        return this.result;
    }
}
```

### Initialize and Use CodeCommentRemover
Set up and use the remover:

```typescript
// main.ts
import { CodeCommentRemover } from './CodeCommentRemover';
import { MyCodeWriter } from './MyCodeWriter';

const codeWriter = new MyCodeWriter();
const remover = new CodeCommentRemover(codeWriter);

const code = `const x = 10; // This is a comment
/* Multi-line
comment */
const y = 20;`;

Array.from(code).forEach(char => remover.trimComment(char));

console.log(codeWriter.getResult());  // Outputs cleaned code
```

## Contributing
Feel free to fork this repository, make improvements, or suggest changes by submitting pull requests or issues.

## License
This project is open-sourced under the MIT License.