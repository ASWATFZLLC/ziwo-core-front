import {ZiwoClient} from '../src/main';

describe('Should successfully set up a ZiwoClient', () => {

  const validOptions = {
    autoConnect: false,
    contactCenterName: 'kalvad-poc',
    credentials: {
      email: 'mathieu@kalvad.com',
      password: 'T0t0#4242',
    },
    debug: false,
    tags: {
      selfTag: {} as HTMLMediaElement,
      peerTag: {} as HTMLMediaElement,
    },
  };

  const client = new ZiwoClient(validOptions);

  it ('Should instantiate a Ziwo Client', () => {
    expect(client).toBeInstanceOf(ZiwoClient);
  });

  it ('Should authenticate an agent over Ziwo API', () => {
    client.connect().then(e => {
      expect(e).toHaveProperty('position');
    }).catch(e => new Error(`ERROR ${e}`));
  });

});
