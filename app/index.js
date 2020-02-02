
var ziwoClient;

function start() {
    document.getElementById('connect-button').style = 'display:none';
    document.getElementById('connecting').style = '';
    ziwoClient = new ziwoCoreFront.ZiwoClient({
        autoConnect: true,
        contactCenterName: document.getElementById('center').value,
        credentials: {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
        },
        video: {
            selfTag: document.getElementById('self-video')
        },
        debug: true,
    }
  );

  ziwoClient.addListener((type, data) => {
    console.log(`[Ziwo Event] ${type}`, data);
    this.pushMessage( `[${type}] ${ JSON.stringify(data) || ''}`)
    switch (type) {
      case 'AgentConnected':
        this.connected();
    }
  })

}

function startCall() {
    ziwoClient.startCall(document.getElementById('phonenumber').value);
}

function startVideoCall() {
    ziwoClient.startVideoCall(document.getElementById('phonenumber').value);
}

/**
 * TOOLS
 */

function pushMessage(message, classList = '') {
  let tag = document.createElement('p');
  tag.innerText = message;
  tag.classList = classList;
  document.getElementById('stream-info').appendChild(tag);
}

function connected() {
  this.hide('not-connected');
  this.show('connected');
}

function disconnected() {
  this.hide('connected');
  this.show('not-connected');
}

function show(classname) {
  const items = document.getElementsByClassName(classname);
  for (var i = 0 ; i < items.length ; i++) {
      items[i].style = '';
  }
}

function hide(classname) {
  const items = document.getElementsByClassName(classname);
  for (var i = 0 ; i < items.length ; i++) {
    items[i].style = 'display:none';
  }
}

hide('connected');
