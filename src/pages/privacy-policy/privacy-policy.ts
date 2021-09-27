import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-privacy-policy',
  templateUrl: 'privacy-policy.html',
})
export class PrivacyPolicyPage {

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
