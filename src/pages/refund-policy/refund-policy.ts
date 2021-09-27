import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-refund-policy',
  templateUrl: 'refund-policy.html',
})
export class RefundPolicyPage {

  constructor(
    public viewCtrl: ViewController,
  
    public shared: SharedDataProvider,
    translate: TranslateService,) {
      this.shared.currentOpenedModel = this;
  }

  dismiss() {
    this.viewCtrl.dismiss();
    this.shared.currentOpenedModel = null;
  }


}
