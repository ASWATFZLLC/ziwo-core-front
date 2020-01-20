import {HelloWorld} from '../src/library';

describe('Hello World', () => {
  it ('displays hello world', () => {
    expect(HelloWorld()).toEqual('Hello World');
  });
});
