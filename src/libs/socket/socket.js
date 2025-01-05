// socket.js
import io from 'socket.io-client';
import Cookies from 'js-cookie';

export default {
  install(app) {
    let s_token = Cookies.get('s_token');
    const socket = io(import.meta.env.VITE_APP_WS_API, {
      transports: ['websocket']
    });  // Replace with your server address

    app.config.globalProperties.$socket = socket;  // Make socket available globally

    socket.on('connect', () => {
      console.log('Connected to server!');
    });


    socket.on('disconnect', (data) => {
      console.log('Disconnected from server!');
      console.log(data)
      // socket.emit('message',{'a':'unauth','s_token':s_token})
      Cookies.remove("v_intract")
      Cookies.remove("v2_intract")
      Cookies.remove("s_intract")
      Cookies.remove("s2_intract")
    });


    socket.on('reconnect_attempt', (data) => {
      console.log('Received reconnection request from server:', data.message);
      // Implement your reconnection logic here (e.g., using timers or manual triggers)
    });

    // Add other event listeners and methods for the socket connection
  },
};