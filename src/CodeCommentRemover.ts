import { ICodeCommentRemover } from "./ICodeCommentRemover";
import { ICodeWriter } from "./ICodeWriter";

enum CommentState {
  SingleLine,
  MultiLine,
  None
}

export class JSCommentRemover implements ICodeCommentRemover {
  constructor(private readonly codeWriter: ICodeWriter) {}
  
  private state = CommentState.None;
  private buffer = "";

  trimComment(c: string): void {
    const actions = {
      [CommentState.None]: this.handleNormalCode,
      [CommentState.SingleLine]: this.handleSingleLineComment,
      [CommentState.MultiLine]: this.handleMultiLineComment
    }
    actions[this.state].call(this, c);
  }

  private handleNormalCode(c: string): void {
    if (this.buffer === "/") {
      this.buffer = "";
      if (c === "/" || c === "*") {
        this.state = c === "/" ? CommentState.SingleLine : CommentState.MultiLine;
        return;
      }
      this.codeWriter.write("/");
    }
    if (c === "/") {
      this.buffer = "/";
    } else {
      this.codeWriter.write(c);
    }
  }

  private handleSingleLineComment(c: string): void {
    if (c === "\n") {
      this.state = CommentState.None;
      this.codeWriter.write(c);
    }
  }

  private handleMultiLineComment(c: string): void {
    if (this.buffer === "*" && c === "/") {
      this.state = CommentState.None;
      this.buffer = "";
    } else {
      this.buffer = c;
    }
  }
}