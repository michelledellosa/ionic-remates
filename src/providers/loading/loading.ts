import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LoadingProvider {
  loading;
  constructor(
    public loadingCtrl: LoadingController,
  ) {}

  show() {
    this.loading = this.loadingCtrl.create({
      duration: 10000
    });
    this.loading.present();
  }
  hide() {
    try {
      this.loading.dismiss();
    } catch (error) { }

  }
  autoHide(time) {
    this.loading = this.loadingCtrl.create({
      duration: time
    });
    this.loading.present();
  }
}
