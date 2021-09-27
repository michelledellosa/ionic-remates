import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, InfiniteScroll } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { TranslateService } from '@ngx-translate/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { CartPage } from '../cart/cart';
import { SearchPage } from '../search/search';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-wish-list',
  animations: [
    trigger(
      'animate', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('500ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('500ms', style({ opacity: 0 }))
        ])
      ]
    )
  ],
  templateUrl: 'wish-list.html',
})
export class WishListPage {
  @ViewChild(InfiniteScroll) infinite: InfiniteScroll;

  page = 0;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpClient: HttpClient,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    translate: TranslateService) {

  }
  getProducts() {
    var dat: { [k: string]: any } = {};
    if (this.shared.customerData.customers_id != null)
      dat.customers_id = this.shared.customerData.customers_id;
    dat.page_number = 0;
    dat.page_number = this.page;
    dat.type = 'wishlist';
    dat.language_id = this.config.langId;
    this.httpClient.post(this.config.url + 'getallproducts', dat).subscribe((data:any) => {
      if (data.success == 1) {
        this.page++;
        var prod = data.product_data;
        for (let value of prod) {
          this.shared.wishList.push(value);
        }
      }
      if (data.success == 0) { this.infinite.enable(false); }
    });
  }
  ngOnInit() {
    this.getProducts();
  }
  openCart() {
    this.navCtrl.push(CartPage);
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }
  ionViewWillEnter() {
    if (this.config.admob == 1) this.shared.showAd();
  }
}
