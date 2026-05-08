import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let client = null;
let pendingSubscriptions = [];

export function connect() {
  if (client) return client;
  client = new Client({
    brokerURL: undefined,
    connectHeaders: {},
    debug: function () {

    },
    reconnectDelay: 5000,
    webSocketFactory: () => new SockJS('http://localhost:8083/ws'),
    onStompError: (frame) => {
      console.error('Broker reported error: ' + (frame.headers && frame.headers['message']));
    },
  });

  client.onConnect = () => {
    pendingSubscriptions.forEach((p) => {
      try {
        const sub = client.subscribe(p.topic, (msg) => {
          try {
            const body = JSON.parse(msg.body);
            p.handler(body);
          } catch (e) {
            console.error('Failed to parse STOMP message', e);
          }
        });
        p._sub = sub;
      } catch (e) {
        console.error('Failed to subscribe to', p.topic, e);
      }
    });

  };

  client.activate();
  return client;
}


export function subscribe(topic, handler) {
  if (!client) {
    
    connect();
  }

  
  if (client && client.connected) {
    const sub = client.subscribe(topic, (msg) => {
      try {
        const body = JSON.parse(msg.body);
        handler(body);
      } catch (e) {
        console.error('Failed to parse STOMP message', e);
      }
    });
    return sub;
  }

  
  const pending = { topic, handler, _sub: null };
  pendingSubscriptions.push(pending);

  return {
    unsubscribe: () => {
      
      const idx = pendingSubscriptions.indexOf(pending);
      if (idx !== -1) {
        pendingSubscriptions.splice(idx, 1);
      }
      
      if (pending._sub) {
        try {
          pending._sub.unsubscribe();
        } catch (e) {
          
        }
      }
    },
  };
}

export function send(destination, payload) {
  if (!client || !client.connected) {
    console.warn('STOMP client not connected; cannot send to', destination);
    return;
  }
  try {
    client.publish({ destination, body: JSON.stringify(payload) });
  } catch (e) {
    console.error('Failed to publish STOMP message', e);
  }
}

export function disconnect() {
  if (!client) return;
  try {
    client.deactivate();
  } catch (e) {
    
  }
  client = null;
  pendingSubscriptions = [];
}
