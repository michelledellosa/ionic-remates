import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Events, Platform } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { LanguagePage } from '../language/language';
import { ConfigProvider } from '../../providers/config/config';
import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';
import { TermServicesPage } from '../term-services/term-services';
import { RefundPolicyPage } from '../refund-policy/refund-policy';
import { LoadingProvider } from '../../providers/loading/loading';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { LoginPage } from '../login/login';
import { MyAccountPage } from '../my-account/my-account';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CartPage } from '../cart/cart';
import { SearchPage } from '../search/search';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AppVersion } from '@ionic-native/app-version';
import { HttpClient } from '@angular/common/http';
import { GooglePlus } from '@ionic-native/google-plus';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  setting: { [k: string]: any } = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public config: ConfigProvider,
    private storage: Storage,
    public loading: LoadingProvider,
    public httpClient: HttpClient,
    private localNotifications: LocalNotifications,
    public events: Events,
    public shared: SharedDataProvider,
    public iab: InAppBrowser,
    private socialSharing: SocialSharing,
    public plt: Platform,
    private appVersion: AppVersion,
    private st : NativeStorage,
    private google : GooglePlus
  ) {

  }


  turnOnOffNotification(value) {
    if (this.setting.localNotification == false) {
      this.localNotifications.cancel(1).then((result) => {
      });
    }
    else {
      this.localNotifications.schedule({
        id: 1,
        title: this.config.notifTitle,
        text: this.config.notifText,
        every: this.config.notifDuration,
      });
    }

    this.updateSetting();
  }

  updateSetting() {
    console.log(this.setting);
    this.storage.set('setting', this.setting);
  }
  openLoginPage() {
    let modal = this.modalCtrl.create(LoginPage);
    //ionic modal.present();
    this.navCtrl.setRoot(LoginPage);
  }
  logOut() {
    console.log(this.shared.customerData.customers_id);
    this.shared.logOut();
    this.st.setItem('credenciales',{email : '',
      nombre : '',
      valida : false})
    this.google.logout();
    this.navCtrl.setRoot(LoginPage)
  }
  openPage(page) {
    if (page == 'myAccount') this.navCtrl.push(MyAccountPage);
  }
  openSite() {
    this.loading.autoHide(2000);
    this.iab.create(this.config.siteUrl, "blank");
  }
  
  // local notification
  onOffPushNotification() {
    this.storage.get('registrationId').then((registrationId) => {
      var dat: { [k: string]: any } = {};
      dat.device_id = registrationId;
      if (this.setting.notification == false) dat.is_notify = 0;
      else dat.is_notify = 1;
      this.httpClient.post(this.config.url + 'notify_me', dat).subscribe((data:any) => {
        if (data.success == 1) {

          this.updateSetting();
        }
      }, function (response) {
        console.log(response);
      });
    });
  };
  hideShowFooterMenu() {
    this.events.publish('setting', this.setting);
    this.updateSetting();
  }
  hideShowCartButton() {
    this.events.publish('setting', this.setting);
    this.updateSetting();
  }
  showModal(value) {
    this.loading.autoHide(1000);
    if (value == 'privacyPolicy') {
      let modal = this.modalCtrl.create(PrivacyPolicyPage);
      modal.present();
    }
    else if (value == 'termServices') {
      let modal = this.modalCtrl.create(TermServicesPage);
      modal.present();
    }
    else if (value == 'language') {
      let modal = this.modalCtrl.create(LanguagePage);
      modal.present();
    }
    else {
      let modal = this.modalCtrl.create(RefundPolicyPage);
      modal.present();
    }
  }
  ionViewDidLoad() {
    this.storage.get('setting').then((val) => {
      if (val != null || val != undefined) {
        this.setting = val;

      }
      else {
        this.setting.localNotification = true;
        this.setting.notification = true;
        this.setting.cartButton = true;
        this.setting.footer = true;
      }
    });
  }

  openCart() {
    this.navCtrl.push(CartPage);
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }
  rateUs() {
    this.loading.autoHide(2000);
    if (this.plt.is('ios')) {
      this.iab.create(this.config.packgeName.toString(), "_system");
    } else if (this.plt.is('android')) {
      this.appVersion.getPackageName().then((val) => {
        this.iab.create("https://play.google.com/store/apps/details?id=" + val, "_system");
      });
    }
  }
  share() {
    this.loading.autoHide(2000);
    if (this.plt.is('ios')) {
      this.socialSharing.share(
        this.config.packgeName.toString(),
        this.config.appName,
        this.config.packgeName.toString(),
        this.config.packgeName.toString()
      ).then(() => {
      }).catch(() => {

      });
    } else if (this.plt.is('android')) {

      this.appVersion.getPackageName().then((val) => {
        this.socialSharing.share(
          this.config.appName,
          this.config.appName,
          "",
          "https://play.google.com/store/apps/details?id=" + val
        ).then(() => {

        }).catch(() => {
        });
      });
    }
  }
  showAd() {
    this.loading.autoHide(2000);
    this.events.publish('showAd');
  }
}
