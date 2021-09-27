import { Component } from '@angular/core';
import { NavController, NavParams, ModalController,Events } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { SocialSharing } from '@ionic-native/social-sharing';
import { LoginPage } from '../login/login';
import { LoadingProvider } from '../../providers/loading/loading';
import { HttpClient } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ShippingAddressPage } from '../shipping-address/shipping-address';
import { ProductsPage } from '../products/products';
import { Storage } from '@ionic/storage';
import {HomePage} from '../home/home';
import { Toast } from '@ionic-native/toast';
import { trigger, style, animate, transition } from '@angular/animations';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-product-detail',
  animations: [
    trigger(
      'animate', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('500ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('700ms', style({ opacity: 0 }))
        ])
      ]
    )
  ],
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage {
  public product;

  attributes = [];
  selectAttribute = true;
  discount_price;
  flash_price;
  product_price;
  cartButton = "addToCart";
  is_upcomming = false;
  total: any;
  

  constructor(
    public navCtrl: NavController,
    public iab: InAppBrowser,
    public navParams: NavParams,
    public config: ConfigProvider,
    public storage: Storage,
    public httpClient: HttpClient,
    public shared: SharedDataProvider,
    public modalCtrl: ModalController,
    public loading: LoadingProvider,
    public toast: Toast,
    public events: Events,
    private toastCtrl: ToastController,
    private socialSharing: SocialSharing) {

    this.product = navParams.get('data');
    console.log('viene this.product');
    console.log(this.product);
    this.discount_price = this.product.discount_price;
    this.product_price = this.product.products_price;
    this.flash_price = this.product.flash_price;
    this.product.products_quantity = this.product.products_min_order;
    if (this.product.products_type == 0 && this.product.defaultStock == 0) this.cartButton = "outOfStock";
    if (this.product.products_type == 1) this.cartButton = "addToCart";
    if (this.product.products_type == 2) this.cartButton = "external";

    if (this.product.attributes != null && this.product.attributes != undefined && this.product.attributes.length != 0) {
      //this.selectAttribute = this.product.attributes[0].values[0];
      // console.log(this.selectAttribute);
      this.product.attributes.forEach((value, index) => {

        var att = {
          products_options_id: value.option.id,
          products_options: value.option.name,
          products_options_values_id: value.values[0].id,
          options_values_price: value.values[0].price,
          price_prefix: value.values[0].price_prefix,
          products_options_values: value.values[0].value,
          attribute_id: value.values[0].products_attributes_id,
          name: value.values[0].value + ' ' + value.values[0].price_prefix + value.values[0].price + " " + this.config.currency
        };

        this.attributes.push(att);
      });
      this.checkAvailability();
      console.log(this.attributes);
    }

  }

/***********************************************************************/


totalPrice() {
  var price = 0;

  price= this.product.flash_price  * this.product.products_quantity;
  for (let value of this.product) {


  }
  this.total = price;
};

removeCart(id) {
  this.shared.removeCart(id);
  this.totalPrice();
}

qunatityPlus = function (q) {
  this.toast.show(`Product Quantity is Limited!`, 'short', 'center');

   q.products_quantity++;
    console.log(q.products_quantity);
   
   q.subtotal = q.final_price * q.products_quantity;
   q.total = q.subtotal;

   this.totalPrice();
   this.shared.cartTotalItems();
   this.storage.set('cartProducts', this.shared.cartProducts);
 }


qunatityMinus = function (q) {
  
  if (q.products_quantity <= q.products_min_order ) {
    return q.products_min_order;
  }else{
    q.products_quantity--;
    q.subtotal = q.final_price * q.products_quantity;
    q.total = q.subtotal;
    ///this.shared.cartProducts.obj.price = 7;
    this.totalPrice();
  
    this.shared.cartTotalItems();
    this.storage.set('cartProducts', this.shared.cartProducts);
  }

}
ionViewDidLoad() {
  this.totalPrice()
}
proceedToCheckOut() {

  if (this.shared.customerData.customers_id == null || this.shared.customerData.customers_id == undefined) {
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
  }
  else {
    this.navCtrl.push(ShippingAddressPage);
  }
}

openProductsPage() {
  this.navCtrl.push(ProductsPage, { sortOrder: 'newest' });
}

openHomePage() {
  this.navCtrl.push(HomePage, { sortOrder: 'home' });
}

 ionViewWillEnter() {
   if (this.config.admob == 1) this.shared.showAd();
 }

/*****************************************************************************/
  checkAvailability() {
    this.loading.show();
    let att = [];
    for (let a of this.attributes) {
      att.push(a.attribute_id.toString());
    }

    let data = {
      products_id: this.product.products_id.toString(),
      attributes: att
    };

  }
  openProductUrl() {
    this.loading.autoHide(2000);
    this.iab.create(this.product.products_url, "blank");
  }
  addToCartProduct() {
    this.loading.autoHide(500);
    console.log('Total de productos ---- '+this.product.products_quantity);
    this.shared.addToCart(this.product, this.attributes);
    this.navCtrl.pop();
  }

  fillAttributes = function (val, optionID) {

    //console.log(val);
    //  console.log(this.attributes);
    this.attributes.forEach((value, index) => {
  
      if (optionID == value.products_options_id) {
        value.products_options_values_id = val.id;
        value.options_values_price = val.price;
        value.price_prefix = val.price_prefix;
        value.attribute_id = val.products_attributes_id;
        value.products_options_values = val.value;
        value.name = val.value + ' ' + val.price_prefix + val.price + " " + this.config.currency
      }
    });
    console.log(this.attributes);
    //calculating total price 
    this.calculatingTotalPrice();
    this.checkAvailability();
  };
  //============================================================================================  
  //calculating total price  
  calculatingTotalPrice = function () {
    var price = parseFloat(this.product.products_price.toString());
    if (this.product.discount_price != null || this.product.discount_price != undefined)
      price = this.product.discount_price;
    var totalPrice = this.shared.calculateFinalPriceService(this.attributes) + parseFloat(price.toString());

    if (this.product.discount_price != null || this.product.discount_price != undefined)
      this.discount_price = totalPrice;
    else
      this.product_price = totalPrice;
    //  console.log(totalPrice);
  };

  checkProductNew() {
    var pDate = new Date(this.product.products_date_added);
    var date = pDate.getTime() + this.config.newProductDuration * 86400000;
    var todayDate = new Date().getTime();
    if (date > todayDate)
      return true;
    else
      return false
  }

  pDiscount() {
    var rtn = "";
    var p1 = parseInt(this.product.products_price);
    var p2 = parseInt(this.product.discount_price);
    if (p1 == 0 || p2 == null || p2 == undefined || p2 == 0) { rtn = ""; }
    var result = Math.abs((p1 - p2) / p1 * 100);
    result = parseInt(result.toString());
    if (result == 0) { rtn = "" }
    rtn = result + '%';
    return rtn;
  }
  share() {
    this.loading.autoHide(1000);
    // Share via email
    this.socialSharing.share(
      this.product.products_name,
      this.product.products_name,
      this.config.url + this.product.products_image,
      this.product.products_url).then(() => {
        // Success!
      }).catch(() => {
        // Error!
      });

  }
  clickWishList() {

    if (this.shared.customerData.customers_id == null || this.shared.customerData.customers_id == undefined) {
      let modal = this.modalCtrl.create(LoginPage);
      modal.present();
    }
    else {
      if (this.product.isLiked == '0') { this.addWishList(); }
      else this.removeWishList();
    }
  }
  addWishList() {
    this.shared.addWishList(this.product);
  }
  removeWishList() {
    this.shared.removeWishList(this.product);
  }
  ngOnInit() {
    
    if (this.product.flash_start_date) {
      if (this.product.server_time < this.product.flash_start_date) this.is_upcomming = true;
      console.log("server time less than " + (this.product.server_time - this.product.flash_start_date));
    }
  }

}
