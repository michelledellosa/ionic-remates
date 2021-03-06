import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { ConfigProvider } from '../../providers/config/config';
import { SubCategoriesPage } from '../sub-categories/sub-categories';
import { trigger, style, animate, transition } from '@angular/animations';
import { CartPage } from '../cart/cart';
import { SearchPage } from '../search/search';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-categories',
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
  templateUrl: 'categories.html',
})
export class CategoriesPage {

  constructor(
    public navCtrl: NavController,
    public shared: SharedDataProvider,
    public config: ConfigProvider,
    private translateService: TranslateService,
  ) {
    this.translateService.setTranslation('en-es',{"Men's Clothing": 'Ropa Masculina'} )
     
  }

  rmen: String = "Men's Clothing";

  openSubCategories(parent) {
    this.navCtrl.push(SubCategoriesPage, { 'parent': parent });
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
