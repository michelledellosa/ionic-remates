import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, Searchbar } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';

import { LoadingProvider } from '../../providers/loading/loading';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'page-select-country',
  templateUrl: 'select-country.html',
})
export class SelectCountryPage {
  @ViewChild('Searchbar') searchBar: Searchbar;
  searchQuery: string = '';
  items;
  countries = new Array;

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
    var dat = { type: 'null' };
    httpClient.post(this.config.url + 'getcountries', dat).subscribe((data:any) => {
      loading.hide();
      this.items = this.countries = data.data
      setTimeout(() => { this.searchBar.setFocus(); }, 250);
    });
  }

  initializeItems() {
    this.items = this.countries
  }

  getItems(ev: any) {
    this.initializeItems();

    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.countries_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
    this.shared.currentOpenedModel = null;
  }

  selectCountry(c) {
    if (this.navParams.get('page') == 'shipping') {
      this.shared.orderDetails.delivery_country = c.countries_name;
      this.shared.orderDetails.delivery_country_code = c.countries_id;
      this.shared.orderDetails.delivery_country_id = c.countries_id;
      this.shared.orderDetails.delivery_zone = null;
      this.shared.orderDetails.delivery_state = null;
    }
    else if (this.navParams.get('page') == 'editShipping') {
      this.shared.tempdata.entry_country_id = c.countries_id;
      this.shared.tempdata.entry_country_name = c.countries_name;
      this.shared.tempdata.entry_country_code = c.countries_id;
      this.shared.tempdata.entry_zone = null;
    }
    else {
      this.shared.orderDetails.billing_country = c.countries_name;
      this.shared.orderDetails.billing_country_code = c.countries_id;
      this.shared.orderDetails.billing_country_id = c.countries_id;
      this.shared.orderDetails.billing_zone = null;
      this.shared.orderDetails.billing_state = null;
    }
    this.dismiss();
  }
}
