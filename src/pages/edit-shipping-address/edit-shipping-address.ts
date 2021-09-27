import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

import { ConfigProvider } from '../../providers/config/config';
import { LoadingProvider } from '../../providers/loading/loading';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { SelectCountryPage } from '../select-country/select-country';
import { SelectZonesPage } from '../select-zones/select-zones';
import { AlertProvider } from '../../providers/alert/alert';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-edit-shipping-address',
  templateUrl: 'edit-shipping-address.html',
})
export class EditShippingAddressPage {
  shippingData: { [k: string]: any } = {};
  data;
  type = 'update';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpClient: HttpClient,
    public config: ConfigProvider,
    public viewCtrl: ViewController,
    public loading: LoadingProvider,
    public modalCtrl: ModalController,
    public shared: SharedDataProvider,
    public alert: AlertProvider,
  ) {

    this.data = navParams.get('data');
    this.type = navParams.get('type');

    if (this.type != 'add') {
      this.shippingData.entry_firstname = this.data.firstname;
      this.shippingData.entry_lastname = this.data.lastname;
      this.shippingData.entry_street_address = this.data.street;
      this.shippingData.entry_country_name = this.data.country_name;
      this.shippingData.entry_zone = this.data.zone_name;
      this.shippingData.entry_postcode = this.data.postcode;
      this.shippingData.entry_country_id = this.data.countries_id;
      this.shippingData.entry_address_id = this.data.address_id;
      this.shippingData.entry_city = this.data.city;
      this.shippingData.entry_zone_id = this.data.zone_id;
      this.shippingData.entry_state = this.data.state;
      this.shippingData.suburb = this.data.suburb;
      this.shippingData.address_id = this.data.address_id;
    }
    // console.log(this.data);
    // console.log(this.shippingData);
  }

  selectCountryPage() {
    let modal = this.modalCtrl.create(SelectCountryPage, { page: 'editShipping' });
    modal.present();
  }
  selectZonePage() {
    let modal = this.modalCtrl.create(SelectZonesPage, { page: 'editShipping', id: this.shippingData.entry_country_id });
    modal.present();
  }
  //close modal
  dismiss() {
    this.viewCtrl.dismiss();
  }

  
  addShippingAddress = function (form) {
    this.loading.show();
    this.shippingData.customers_id = this.shared.customerData.customers_id;
    var dat = this.shippingData;
    dat.entry_state = dat.delivery_zone;
    dat.entry_zone = dat.delivery_zone;
    this.httpClient.post(this.config.url + 'addshippingaddress', dat).subscribe((data:any) => {
      this.loading.hide();
      this.dismiss();
      this.shared.toast(data.message);
    }, function (response) {
      this.loading.hide();
      console.log(response);
    });
  };

  updateShippingAddress = function (form, id) {
    this.loading.show();
    this.shippingData.customers_id = this.shared.customerData.customers_id;
    var dat = this.shippingData;
    dat.entry_state = dat.delivery_zone;
    dat.entry_zone = dat.delivery_zone;
    this.httpClient.post(this.config.url + 'updateshippingaddress', dat).subscribe((data:any) => {
      this.loading.hide();
      if (data.success == 1) {
        this.dismiss();
        this.shared.toast(data.message);
      }
    }, function (response) {
      this.loading.hide();
      console.log(response);
    });

  };
  ionViewWillEnter() {
    if (this.shared.tempdata.entry_country_id != undefined) {

      this.shippingData.entry_country_id = this.shared.tempdata.entry_country_id;
      this.shippingData.entry_country_name = this.shared.tempdata.entry_country_name;
      this.shippingData.entry_country_code = this.shared.tempdata.entry_country_code;
      this.shippingData.entry_zone = this.shared.tempdata.entry_zone;

    }
    if (this.shared.tempdata.entry_zone != undefined) {
      this.shippingData.entry_zone = this.shared.tempdata.entry_zone;
      this.shippingData.entry_zone_id = this.shared.tempdata.entry_zone_id;
    }
  }
}
