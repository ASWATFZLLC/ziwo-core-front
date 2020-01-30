
function start() {
  var ziwoClient = new ziwoCoreFront.ZiwoClient({
      autoConnect: true,
      contactCenterName: 'kalvad-poc',
      credentials: {
        email: 'mathieu@kalvad.com',
        password: 'T0t0#4242'
      },
      video: {
          selfTag: document.getElementById('self-video')
      }
  });

  ziwoClient.addListener((type, data) => {
    console.log(`[Ziwo Event] ${type}`, data);
    switch (type) {
      case 'AgentConnected':
        ziwoClient.startCall('0643085503');
    }
  })

}

////
start();
