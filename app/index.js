
function start() {
  var ziwoClient = new ziwoCoreFront.ZiwoClient({
      autoConnect: true,
      contactCenterName: 'kalvad-poc',
      credentials: {
        email: 'mathieu@kalvad.com',
        password: 'P]o9r*Sk'
      }
  });

}

////
start();
