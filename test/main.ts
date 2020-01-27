import {HelloWorld} from '../src/main';

describe('Hello World', () => {
  it ('displays hello world', () => {
    expect(HelloWorld()).toEqual('Hello World');
  });
});
