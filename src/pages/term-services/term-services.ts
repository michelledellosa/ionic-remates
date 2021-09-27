import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';


@Component({
  selector: 'page-term-services',
  templateUrl: 'term-services.html',
})
export class TermServicesPage {

  constructor(
    public viewCtrl: ViewController,
    public shared: SharedDataProvider,
    translate: TranslateService, ) {
      this.shared.currentOpenedModel = this;
  }

  dismiss() {
    this.viewCtrl.dismiss();
    this.shared.currentOpenedModel = null;
  }


}
