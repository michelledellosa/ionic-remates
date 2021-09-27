import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { TranslateService } from '@ngx-translate/core';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { LoadingProvider } from '../../providers/loading/loading';
import { AlertProvider } from '../../providers/alert/alert';
import { OrderDetailPage } from '../order-detail/order-detail';
import { CartPage } from '../cart/cart';
import { SearchPage } from '../search/search';
import { HttpClient } from '@angular/common/http';
import { ProductsPage } from '../products/products';


@Component({
  selector: 'page-my-orders',
  templateUrl: 'my-orders.html',
})
export class MyOrdersPage {
  orders = new Array;
  httpRunning = true;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpClient: HttpClient,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    translate: TranslateService,
    public alert: AlertProvider,
    public loading: LoadingProvider
  ) {
  }
  getOrders() {
    this.httpRunning = true;
    this.orders = [];
    this.loading.show();
    var dat: { [k: string]: any } = {};
    dat.customers_id = this.shared.customerData.customers_id;
    dat.language_id = this.config.langId;
    this.httpClient.post(this.config.url + 'getorders', dat).subscribe((data: any) => {
      this.loading.hide();
      this.httpRunning = false;
      //$rootScope.address=response.data.data;
      if (data.success == 1) {
        this.orders = [];
        this.orders = data.data;
      }
      // $scope.$broadcast('scroll.refreshComplete');
    },
      function (response) {
        this.loading.hide();

        this.shared.toast("Server Error while Loading Orders");
        console.log(response);
      });
  };

  showOrderDetail(order) {

    this.navCtrl.push(OrderDetailPage, { 'data': order });

  }
  openProductsPage() {
    this.navCtrl.push(ProductsPage, { sortOrder: 'newest' });
  }
  ionViewDidLoad() {
    this.httpRunning = true;
    this.getOrders();
  }
  openCart() {
    this.navCtrl.push(CartPage);
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }
}
