
function start() {
  var ziwoClient = new ziwoCoreFront.ZiwoClient({
      autoConnect: true,
      contactCenterName: 'kalvad-poc',
      credentials: {
        email: 'mathieu@kalvad.com',
        password: 'T0t0#4242'
      }
  });

}

////
start();
