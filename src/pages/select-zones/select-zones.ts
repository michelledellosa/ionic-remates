import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';

import { LoadingProvider } from '../../providers/loading/loading';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'page-select-zones',
  templateUrl: 'select-zones.html',
})
export class SelectZonesPage {

  searchQuery: string = '';
  items;
  zones = new Array;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public httpClient: HttpClient,
    public config: ConfigProvider,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public loading: LoadingProvider,
    public shared: SharedDataProvider, ) {

      this.shared.currentOpenedModel = this;

    loading.show();
    var dat = { zone_country_id: this.navParams.get('id') };
    httpClient.post(this.config.url + 'getzones', dat).subscribe((data:any) => {
      loading.hide();
      this.items = this.zones = data.data;
    });
  }

  initializeItems() {
    this.items = this.zones
  }

  getItems(ev: any) {
    this.initializeItems();

    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.zone_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  //close modal
  dismiss() {
    this.viewCtrl.dismiss();
    this.shared.currentOpenedModel = null;
  }

  selectZone(c) {
    if (this.navParams.get('page') == 'shipping') {
      if (c == 'other') {
        //  console.log(c);
        this.shared.orderDetails.delivery_zone = 'other';
        this.shared.orderDetails.delivery_state = 'other';
        this.shared.orderDetails.tax_zone_id = null;
      }

      else {
        this.shared.orderDetails.delivery_zone = c.zone_name;
        this.shared.orderDetails.delivery_state = c.zone_name;
        this.shared.orderDetails.tax_zone_id = c.zone_id;
      }
    }
    else if (this.navParams.get('page') == 'editShipping') {
      if (c == 'other') {
        this.shared.tempdata.entry_zone = 'other';
        this.shared.tempdata.entry_zone_id = 0;
      }

      else {
        this.shared.tempdata.entry_zone = c.zone_name;
        this.shared.tempdata.entry_zone_id = c.zone_id;
      }
    }
    else {
      if (c == 'other') {
        this.shared.orderDetails.billing_zone = 'other';
        this.shared.orderDetails.billing_state = 'other';
      }

      else {
        this.shared.orderDetails.billing_zone = c.zone_name;
        this.shared.orderDetails.billing_state = c.zone_name;
      }
    }
    this.dismiss();
  }
}
