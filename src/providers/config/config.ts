import { Injectable } from "@angular/core";
import { LocalNotifications } from "@ionic-native/local-notifications";
import { Storage } from '@ionic/storage';
import { Platform } from "ionic-angular";
import { Md5 } from 'ts-md5/dist/md5';
import { Http, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';

@Injectable()

export class ConfigProvider {

  public yourSiteUrl: string = 'http://www.remateschina.com';
  public consumerKey: string = "6df56cf915318431043dd7a75d";
  public consumerSecret: string = "95032b42153184310488f5fb8f";

  public showIntroPage = 1; //  0 to hide and 1 to show intro page
  public appInProduction = true;//  0 to hide and 1 to show intro page
  public defaultIcons = false; //  0 to hide and 1 to show intro page

  public url: string = this.yourSiteUrl + '/app/';
  public imgUrl: string = this.yourSiteUrl + "/";
  public langId: string = localStorage.langId;
  public loader = 'dots';
  public newProductDuration = 100;
  public cartButton = 1;//1 = show and 0 = hide
  public currency = "$";
  public currencyPos = "left";
  public paypalCurrencySymbol = 'USD';
  public address;
  public fbId;
  public email;
  public latitude;
  public longitude;
  public phoneNo;
  public pushNotificationSenderId;
  public lazyLoadingGif;
  public notifText;
  public notifTitle;
  public notifDuration;
  public footerShowHide;
  public homePage = 1;
  public categoryPage = 1;
  public siteUrl = '';
  public appName = '';
  public packgeName = "";
  public introPage = 1;
  public myOrdersPage = 1;
  public newsPage = 1;
  public wishListPage = 1;
  public shippingAddressPage = 1;
  public aboutUsPage = 1;
  public contactUsPage = 1;
  public editProfilePage = 1;
  public settingPage = 1;
  public admob = 1;
  public admobBannerid = '';
  public admobIntid = '';
  public admobIos = 1;
  public admobBanneridIos = '';
  public admobIntidIos = '';
  public googleAnalaytics = "";
  public rateApp = 1;
  public shareApp = 1;
  public fbButton = 1;
  public googleButton = 1;
  public notificationType = "";
  public onesignalAppId = "";
  public onesignalSenderId = "";


  constructor(
    public storage: Storage,
    public platform: Platform,
    public md5: Md5,
    public localNotifications: LocalNotifications,
    public http: Http,

  ) {
  }
  public siteSetting() {
    let d = new Date();
    let heads = new Headers({
      'consumer-key': Md5.hashStr(this.consumerKey),
      'consumer-secret': Md5.hashStr(this.consumerSecret),
      'consumer-nonce': d.getTime().toString(),
      'consumer-device-id': 'device id of the app'
    });
    let options = new RequestOptions({ headers: heads });

    return new Promise(resolve => {
      this.http.get(this.url + 'sitesetting', options).map(res => res.json()).subscribe((data: any) => {
        var settings = data.data;
        this.fbId = settings.facebook_app_id;
        this.address = settings.address + ', ' + settings.city + ', ' + settings.state + ' ' + settings.zip + ', ' + settings.country;
        this.email = settings.contact_us_email;
        this.latitude = settings.latitude;
        this.longitude = settings.longitude;
        this.phoneNo = settings.phone_no;
        this.pushNotificationSenderId = settings.fcm_android_sender_id;
        this.lazyLoadingGif = settings.lazzy_loading_effect;
        this.newProductDuration = settings.new_product_duration;
        this.notifText = settings.notification_text;
        this.notifTitle = settings.notification_title;
        this.notifDuration = settings.notification_duration;
        this.currency = settings.currency_symbol;
        this.cartButton = settings.cart_button;
        this.footerShowHide = settings.footer_button;
        this.setLocalNotification();
        this.appName = settings.app_name;
        this.homePage = settings.home_style;
        this.categoryPage = settings.category_style;
        this.siteUrl = settings.site_url;
        this.introPage = settings.intro_page;
        this.myOrdersPage = settings.my_orders_page;
        this.newsPage = settings.news_page;
        this.wishListPage = settings.wish_list_page;
        this.shippingAddressPage = settings.shipping_address_page;
        this.aboutUsPage = settings.about_us_page;
        this.contactUsPage = settings.contact_us_page;
        this.editProfilePage = settings.edit_profile_page;
        this.packgeName = settings.package_name;
        this.settingPage = settings.setting_page;
        this.admob = settings.admob;
        this.admobBannerid = settings.ad_unit_id_banner;
        this.admobIntid = settings.ad_unit_id_interstitial;
        this.googleAnalaytics = settings.google_analytic_id;
        this.rateApp = settings.rate_app;
        this.shareApp = settings.share_app;
        this.fbButton = settings.facebook_login;
        this.googleButton = settings.google_login;
        this.notificationType = settings.default_notification;
        this.onesignalAppId = settings.onesignal_app_id;
        this.onesignalSenderId = settings.onesignal_sender_id;
        this.admobIos = settings.ios_admob;
        this.admobBanneridIos = settings.ios_ad_unit_id_banner;
        this.admobIntidIos = settings.ios_ad_unit_id_interstitial;
        this.defaultIcons = (settings.app_icon_image == "icon") ? true : false;
        //resolve();
      });
    });
  }
  //Subscribe for local notification when application is start for the first time
  setLocalNotification() {
    this.platform.ready().then(() => {
      this.storage.get('localNotification').then((val) => {
        if (val == undefined) {
          this.storage.set('localNotification', 'localNotification');
          this.localNotifications.schedule({
            id: 1,
            title: this.notifTitle,
            text: this.notifText,
            every: this.notifDuration,
          });
        }
      });
    });
  }


}