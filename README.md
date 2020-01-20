# Seed for Typescript Library

## About this seed

## Commands

| Command       | Description                     |
| ------------- | ------------------------------- |
| build         | Build the library into `/dist`  |
| start         | Start the library in watch mode |
| lint          | Run tslint                      |
| test          | Run the unit tests              |
| test:coverage | Display a test coverage report  |

## Coding standards

### Typescript

#### Styles

DO:
1. Use 2 space per indentation
2. Use Single Quote only `'`
3. Surround loop and conditional bodies with curly braces. Statements on same line are allow to omit braces
4. Commas `,`, colons `:` and semi-colons `;` are followed by a single space
5. End of statement must be followed by semi-colons `;`

DO NOT:
1. Do not use `var` to declare variable. Instead use `const` or `let`
2. Do not use `<type>myVar` for casting. Instead use `as` keyword
3. Do not declare multiple variables with a single variable statement (`let x = 1, y = 2` is forbidden)
4. Do not use anonymous functions. Instead use arrow functions
5. Do not include white spaces in import

#### Files & Declaration

DO:
1. 1 file per logical component

DO NOT:
2. Do not export type/functions/interface/class unless you need to share it across multiple components

#### Names

DO:
1. Use PascalCase for type names
2. Use PascalCase for enum values
3. Use camelCase for function names
4. Use camelCase for property name and local variables
5. Use whole words when possible. One letter variable names are only allowed in arrow functions

DO NOT:
1. Do not use `_` for private properties
2. Do not use `I` as a prefix for interface names

#### Types

DO:
1. Variable must all be typed. Type may be omitted if the variable is assigned in the same statement
2. Function must all have a return type (even `void`)

DO NOT:
1. Do not use anonymous types. Instead use `Interface`
2. Do not use `'x'|'y`' as type. Instead use `Enum`
3. Do not include white space before nor after semicolor of type definition
4. Avoid using type `any`

#### Classes

DO:
1. Always add function visibility (`public`/`private`/`protected`)
2. Always add property visibility (`public`/`private`/`protected`)
3. Break the constructor into multiple line in order to keep 1 injection per line
4. Declare all the properties before the constructor
5. Declare all the functions after the constructor
6. Public properties must be declared before private ones
7. Public functions must be declared before private ones
