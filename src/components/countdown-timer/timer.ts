import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular';
export interface CountdownTimer {
  seconds: number;
  secondsRemaining: number;
  runTimer: boolean;
  hasStarted: boolean;
  hasFinished: boolean;
  displayTime: string;

}

@Component({
  selector: 'timer',
  templateUrl: 'timer.html'
})

export class Timer {
  @Input('data') product;//product data
  public timeInSeconds: number;
  timer: CountdownTimer;
  constructor(
    public events: Events
  ) {
  }
  ngOnInit() {
    console.log(this.timeInSeconds);
    let seconds = this.product.flash_expires_date;
    if (seconds == 0) this.productIsExpired();
    else {
      this.timeInSeconds = seconds - this.product.server_time;
    }
    console.log(this.timeInSeconds);
    this.initTimer();
    this.startTimer();
  }
  productIsExpired() {
    this.events.publish('productExpired', this.product.products_id);
  }
  hasFinished() {
    return this.timer.hasFinished;
  }

  initTimer() {
    if (!this.timeInSeconds) { this.timeInSeconds = 0; }

    this.timer = <CountdownTimer>{
      seconds: this.timeInSeconds,
      runTimer: false,
      hasStarted: false,
      hasFinished: false,
      secondsRemaining: this.timeInSeconds
    };

    this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
  }

  startTimer() {
    this.timer.hasStarted = true;
    this.timer.runTimer = true;
    this.timerTick();
  }

  pauseTimer() {
    this.timer.runTimer = false;
  }

  resumeTimer() {
    this.startTimer();
  }

  timerTick() {
    setTimeout(() => {
      if (!this.timer.runTimer) { return; }
      this.timer.secondsRemaining--;
      this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
      if (this.timer.secondsRemaining > 0) {
        this.timerTick();
      } else {
        this.productIsExpired();
        this.timer.hasFinished = true;
        //console.log(this.id);
      }

    }, 1000);

  }

  getSecondsAsDigitalClock(inputSeconds: number) {
    const secNum = parseInt(inputSeconds.toString(), 10); 
    
    const hours = Math.floor(secNum / 3600);
    const minutes = Math.floor((secNum - (hours * 3600)) / 60);
    const seconds = secNum - (hours * 3600) - (minutes * 60);
    const dias = Math.floor(hours / 24);
    const horas= Math.floor(hours - (dias*24));
    let daystring = '';
    let hoursString = '';
    let minutesString = '';
    let secondsString = '';
    daystring = dias.toString();
    hoursString = (hours < 10) ? '0' + hours : hours.toString();
    minutesString = (minutes < 10) ? '0' + minutes : minutes.toString();
    secondsString = (seconds < 10) ? '0' + seconds : seconds.toString();
    if(hours<24){
      return hoursString + 'h:' + minutesString + 'm:' + secondsString + 's';
    }else{
      if(horas>=1){
        return daystring + ' días: ' + horas.toString()+' horas';
      }

      return daystring + 'días ';
    }
    
  }

}
