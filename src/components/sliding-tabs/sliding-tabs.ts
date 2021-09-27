import { Component, ViewChild, Input } from '@angular/core';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { ConfigProvider } from '../../providers/config/config';
import { LoadingProvider } from '../../providers/loading/loading';
import { InfiniteScroll } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'sliding-tabs',
  templateUrl: 'sliding-tabs.html'
})
export class SlidingTabsComponent {
  @ViewChild(InfiniteScroll) infinite: InfiniteScroll;

  @Input('type') type;//product data
  products = new Array;
  selected = '';
  page = 0;
  httpRunning = true;

  constructor(
    public shared: SharedDataProvider,
    public httpClient: HttpClient,
    public config: ConfigProvider,
    public loading: LoadingProvider,
  ) {
  }
  getProducts(infiniteScroll) {
    this.httpRunning = true;
    if (this.page == 0) { this.loading.autoHide(700); }
    var dat: { [k: string]: any } = {};
    dat.customers_id = null;
    dat.categories_id = this.selected;
    dat.page_number = this.page;

    dat.language_id = this.config.langId;
    this.httpClient.post(this.config.url + 'getallproducts', dat).subscribe((data:any) => {
      this.httpRunning = false;

      this.infinite.complete();
      if (this.page == 0) {
      this.products = new Array;
        // this.loading.hide();
      }
      if (data.success == 1) {
        this.page++;
        var prod = data.product_data;
        for (let value of prod) {
          this.products.push(value);
        }
      }
      if (data.success == 0) { this.infinite.enable(false); }
    });
    // console.log(this.products.length + "   " + this.page);
  }

  //changing tab
  changeTab(c) {
    this.infinite.enable(true);
    this.page = 0;
    if (c == '') this.selected = c
    else this.selected = c.id;
    this.getProducts(null);
  }


  ngOnInit() {
    this.getProducts(null);
  }

}
