import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, InfiniteScroll } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { LoadingProvider } from '../../providers/loading/loading';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { Toast } from '@ionic-native/toast';
import { TranslateService } from '@ngx-translate/core';
import { NewsDetailPage } from '../news-detail/news-detail';
import { NewsListPage } from '../news-list/news-list';
import { CartPage } from '../cart/cart';
import { SearchPage } from '../search/search';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {
  @ViewChild(InfiniteScroll) infinite: InfiniteScroll;
  featuredPosts = new Array;
  segments = 'newest';

  categories = new Array;
  //page varible
  page = 0;

  posts = new Array;
  //page variable
  page2 = 0;
  httpRunning = true;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpClient: HttpClient,
    public config: ConfigProvider,
    public loading: LoadingProvider,
    private toast: Toast,
    public shared: SharedDataProvider,
    translate: TranslateService) {

    var dat: { [k: string]: any } = {};
    dat.language_id = this.config.langId;
    dat.is_feature = 1;
    this.httpClient.post(this.config.url + 'getallnews', dat).subscribe((data: any) => {
      this.featuredPosts = data.news_data;
    });

    this.getPosts();
    this.getCategories();
  }


  getCategories = function () {

    var dat: { [k: string]: any } = {};
    dat.language_id = this.config.langId;
    dat.page_number = this.page2;
    this.httpClient.post(this.config.url + 'allnewscategories', dat).subscribe((data: any) => {

      if (this.page2 == 0) { this.categories = []; }
      if (data.success == 1) {
        this.page2++;
        data.data.forEach((value, index) => {
          this.categories.push(value);
        });
        // console.log(data.data.length);
        this.getCategories();
      }
      if (data.data.length < 9) {// if we get less than 10 products then infinite scroll will de disabled

        if (this.categories.length != 0) {
          this.toast.show(`All Categories Loaded!`, 'short', 'bottom');
        }
      }
    }, function (response) {
      // console.log("Error while loading categories from the server");
      // console.log(response);
    });
  };

  getPosts() {
    this.httpRunning = true;
    var dat: { [k: string]: any } = {};
    dat.language_id = this.config.langId;
    dat.page_number = this.page;
    this.httpClient.post(this.config.url + 'getallnews', dat).subscribe((data: any) => {
      this.httpRunning = false;

      this.infinite.complete();//stopping infinite scroll loader
      if (this.page == 0) {
        this.posts = []; this.infinite.enable(true);
      }
      if (data.success == 1) {
        this.page++;
        data.news_data.forEach((value, index) => {
          this.posts.push(value);
        });
      }
      if (data.news_data.length < 9) {// if we get less than 10 products then infinite scroll will de disabled

        this.infinite.enable(false);//disabling infinite scroll
        if (this.posts.length != 0) {
          this.toast.show(`All Posts Loaded!`, 'short', 'bottom');
        }
      }
    }, function (response) {
      // console.log("Error while loading posts from the server");
      // console.log(response);
    });
  };

  //getting list of sub categories from the server
  showPostDetail(post) {
    this.loading.autoHide(500);
    this.navCtrl.push(NewsDetailPage, { 'post': post });
  };
  openPostsPage(name, id) {
    this.loading.autoHide(500);
    this.navCtrl.push(NewsListPage, { 'name': name, 'id': id });
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
