import { Component } from '@angular/core';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { ConfigProvider } from '../../providers/config/config';
import { NavController, NavParams } from 'ionic-angular';
import { ProductsPage } from '../../pages/products/products';
import { LoadingProvider } from '../../providers/loading/loading';
import { ProductDetailPage } from '../../pages/product-detail/product-detail';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'banners',
  templateUrl: 'banners.html'
})
export class BannersComponent {

  constructor(
    public shared: SharedDataProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public config: ConfigProvider,
    public httpClient: HttpClient,
    public loading: LoadingProvider,
  ) {

  }

  bannerClick = function (image) {
    //  console.log(image);
    if (image.type == 'category') {
      this.navCtrl.push(ProductsPage, { id: parseInt(image.url) });
    }
    else if (image.type == 'product') {
      this.getSingleProductDetail(parseInt(image.url));
    }
    else {
      this.navCtrl.push(ProductsPage, { sortOrder: image.type });
    }
  }
  
  getSingleProductDetail(id) {
    this.loading.show();

    var dat: { [k: string]: any } = {};
    if (this.shared.customerData != null)
      dat.customers_id = this.shared.customerData.customers_id;
    else
      dat.customers_id = null;
    dat.products_id = id;
    dat.language_id = this.config.langId;
    this.httpClient.post(this.config.url + 'getallproducts', dat).subscribe((data:any) => {
      this.loading.hide();
      if (data.success == 1) {
        this.navCtrl.push(ProductDetailPage, { data: data.product_data[0] });
      }
    });
  }

}
