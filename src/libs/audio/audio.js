// audio.js

import soundfile from '@/assets/audio/long-pop.wav'

class NotificationService {
    constructor() {
      this.audio = new Audio();
    }
  
    playSound() {
      this.audio.src = soundfile;
      this.audio.play();
    }
  
    // You can add more methods for different types of notifications if needed
  }
  
  const notificationService = new NotificationService();
  export default notificationService;