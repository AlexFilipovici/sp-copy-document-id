declare interface ICopyDocumentIdCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'CopyDocumentIdCommandSetStrings' {
  const strings: ICopyDocumentIdCommandSetStrings;
  export = strings;
}
