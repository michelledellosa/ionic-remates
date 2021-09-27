import { Component, Input } from '@angular/core';
import { ConfigProvider } from '../../providers/config/config';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { ProductDetailPage } from '../../pages/product-detail/product-detail';
import { LoginPage } from '../../pages/login/login';
import { HttpClient } from '@angular/common/http';
import { LoadingProvider } from '../../providers/loading/loading';

@Component({
  selector: 'product',
  templateUrl: 'product.html'
})
export class ProductComponent {

  @Input('data') p;//product data
  @Input('type') type;
  // @Output() someEvent = new EventEmitter();

  expired = false;
  is_upcomming = false;
  constructor(
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public events: Events,
    public loading: LoadingProvider,
    public httpClient: HttpClient,
  ) {
    // flash_expires_date
    // flash_start_date
    // server_time

    events.subscribe('wishListUpdate', (id, value) => {
      if (this.p.products_id == id) this.p.isLiked = value
    });

    events.subscribe('productExpired', (id) => {
      if (this.p.products_id == id) this.productExpired();
    });
  }
  productExpired() {
    console.log("expired " + this.p.products_name);
    this.expired = true
  }

  pDiscount() {
    var rtn = "";
    var p1 = parseInt(this.p.products_price);
    var p2 = parseInt(this.p.discount_price);
    if (p1 == 0 || p2 == null || p2 == undefined || p2 == 0) { rtn = ""; }
    var result = Math.abs((p1 - p2) / p1 * 100);
    result = parseInt(result.toString());
    if (result == 0) { rtn = "" }
    rtn = result + '%';
    return rtn;
  }

  showProductDetail() {
    if (this.type == 'flash') {
      this.loading.show();
      var dat: { [k: string]: any } = {};
      if (this.shared.customerData != null)
        dat.customers_id = this.shared.customerData.customers_id;
      else
        dat.customers_id = null;
      dat.products_id = this.p.products_id;
      dat.language_id = this.config.langId;
      dat.type = 'flashsale';
      this.httpClient.post(this.config.url + 'getallproducts', dat).subscribe((data: any) => {
        this.loading.hide();
        if (data.success == 1) {
          this.navCtrl.push(ProductDetailPage, { data: data.product_data[0] });
        }
      });
    }
    else
      this.navCtrl.push(ProductDetailPage, { data: this.p });

    if (this.type != 'recent') this.shared.addToRecent(this.p);
  }

  checkProductNew() {
    var pDate = new Date(this.p.products_date_added);
    var date = pDate.getTime() + this.config.newProductDuration * 86400000;
    var todayDate = new Date().getTime();
    if (date > todayDate)
      return true;
    else
      return false
  }

  addToCart() { this.shared.addToCart(this.p, []); }

  isInCart() {
    var found = false;

    for (let value of this.shared.cartProducts) {
      if (value.products_id == this.p.products_id) { found = true; }
    }

    if (found == true) return true;
    else return false;
  }
  removeRecent() {
    this.shared.removeRecent(this.p);
  }

  clickWishList() {

    if (this.shared.customerData.customers_id == null || this.shared.customerData.customers_id == undefined) {
      let modal = this.modalCtrl.create(LoginPage);
      modal.present();
    }
    else {
      if (this.p.isLiked == '0') { this.addWishList(); }
      else this.removeWishList();
    }
  }
  addWishList() {
    this.shared.addWishList(this.p);
  }
  removeWishList() {
    this.shared.removeWishList(this.p);
  }

  ngOnInit() {
    if (this.type == 'flash') {
      if (this.p.server_time < this.p.flash_start_date) this.is_upcomming = true;
      console.log("server time less than " + (this.p.server_time - this.p.flash_start_date));
    }
  }
}
