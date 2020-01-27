
function start() {
  var ziwoClient = new ziwoCoreFront.ZiwoClient({
      autoConnect: true,
      contactCenterName: 'aldebaran',
      credentials: {
        email: 'ziwo@aswat-telecom.com',
        password: '872ad8cf-0db8-425e-b0db-f91d5da3349e'
      }
  });

}

////
start();
