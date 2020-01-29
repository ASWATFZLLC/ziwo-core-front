
function start() {
  var ziwoClient = new ziwoCoreFront.ZiwoClient({
      autoConnect: true,
      contactCenterName: 'kalvad-poc',
      credentials: {
        email: 'mathieu@kalvad.com',
        password: 'T0t0#4242'
      }
  });

  ziwoClient.addListener((type, data) => {
    console.log(`[Ziwo Event] ${type}`, data);
  })

  ziwoClient.startCall('64308503');

}

////
start();
