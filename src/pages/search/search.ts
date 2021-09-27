import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { AlertProvider } from '../../providers/alert/alert';
import { LoadingProvider } from '../../providers/loading/loading';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { ProductsPage } from '../products/products';
import { CartPage } from '../cart/cart';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  search;
  searchResult = [];
  showCategories = true;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public config: ConfigProvider,
    public httpClient: HttpClient,
    public alert: AlertProvider,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
  ) {
  }

  onChangeKeyword = function (e) {
    
  }

  getSearchData = function () {

    if (this.search != undefined) {
      if (this.search == null || this.search == '') {
        this.shared.toast("Please enter something ");
        return 0;
      }
    }
    else {
      this.shared.toast("Please enter something ");
      return 0;
    }
    this.loading.show();
    this.httpClient.post(this.config.url + 'getsearchdata', { 'searchValue': this.search, 'language_id': this.config.langId }).subscribe((data: any) => {
      this.loading.hide();
      if (data.success == 1) {
        this.searchResult = data.product_data;
        this.showCategories = false;
      }
      if (data.success == 0) {
        this.shared.toast(data.message);
      }
    });
  };

  openProducts(id, name) {
    this.navCtrl.push(ProductsPage, { id: id, name: name, sortOrder: 'newest' });
  }
  openCart() {
    this.navCtrl.push(CartPage);
  }
}
