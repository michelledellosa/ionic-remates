import { Component } from '@angular/core';
import { ViewController, ModalController, NavController, Platform } from 'ionic-angular';
import { SignUpPage } from '../sign-up/sign-up';
import { ConfigProvider } from '../../providers/config/config';
import { LoadingProvider } from '../../providers/loading/loading';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { SharedDataProvider } from '../../providers/shared-data/shared-data';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { AlertProvider } from '../../providers/alert/alert';
import { GooglePlus } from '@ionic-native/google-plus';
import { HttpClient } from '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { HomePage } from '../home/home';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IntroPage } from '../intro/intro';
import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';

import { Home2Page } from '../home2/home2';
import { Home3Page } from '../home3/home3';
import { Home4Page } from '../home4/home4';
import { Home5Page } from '../home5/home5';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',

})
export class LoginPage {
  formData = { email: '', password: '' };
  errorMessage = '';

  payload = {
    accessToken:"",
    created_at: 1556145088  ,
    customers_default_address_id: 0,
    customers_dob: "",
    customers_fax: null,
    customers_firstname: "",
    customers_gender: "0",
    customers_id: 18,
    customers_lastname: "",
    customers_newsletter: null,
    customers_picture: "resources/assets/images/user_profile/default_user.png",
    customers_telephone: "",
    email: "",
    fb_id: null,
    google_id: null,
    isActive: 1,
    is_seen: 0,
    liked_products: [],
    password: "",
    remember_token: "",
    updated_at: 0,
    user_name: ""
  }

  constructor(
    private navCtrl: NavController,
    public httpClient: HttpClient,
    public config: ConfigProvider,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    private fb: Facebook,
    public alert: AlertProvider,
    private googlePlus: GooglePlus,
    private storage : NativeStorage,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private st: Storage,
    private statusBar: StatusBar,
    private admobFree: AdMobFree,
    private plt: Platform
  ) {
    this.shared.currentOpenedModel = this;
  }

  ionViewDidLoad() {
    this.storage.getItem('credenciales').then(data=>{
      if(data.valida){
       // this.initializeApp();
       this.navCtrl.setRoot(HomePage);
      }
    }).catch(err=>{

    })
  }

  login() {
    this.loading.show();
    this.errorMessage = '';
    
    this.httpClient.post(this.config.url + 'processlogin', this.formData).subscribe((data: any) => { 

      this.loading.hide();
      if (data.success == 1) {
        this.shared.login(data.data[0]);
        this.navCtrl.setRoot(HomePage);
      }
      if (data.success == 0) {
        this.errorMessage = data.message;
      }
    });
  }
  openSignUpPage() {
    let modal = this.modalCtrl.create(SignUpPage);
    modal.present();
    
  }
  openForgetPasswordPage() {
    let modal = this.modalCtrl.create(ForgotPasswordPage);
    modal.present();
  }

  facebookLogin() {

    this.loading.autoHide(500);
    this.fb.getLoginStatus().then((res: any) => {
      if (res.status == 'connected') {

        this.createAccount(res, 'fb');

        this.storage.setItem('credenciales', {
              userID : res.authResponse.userID,
              accessToken : res.authResponse.accessToken,
              session_Key : res.authResponse.session_Key,
              valida : true
            })
      }
    });
  
  }


  googleLogin() {     
    this.loading.autoHide(500);
    this.googlePlus.login({})
    .then(res => {
       this.payload.customers_firstname = res.displayName;
       this.payload.email = res.email;
       this.payload.accessToken=res.accessToken;
 
       this.storage.setItem('credenciales', {
        email : res.email,
        nombre : res.displayName,
        valida : true
        })
        this.createAccount(res,'google');
      }
      
      )
      .catch(
        err => this.alert.show(JSON.stringify(err))      
      );

      
  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.config.siteSetting().then((value) => {
        this.st.get('firsttimeApp').then((val) => {
          let value = val;
          if (this.config.showIntroPage == 0) value = 'firstTime';

          if (this.config.homePage == 1) { this.navCtrl.setRoot(HomePage)  }
          if (this.config.homePage == 2) { this.navCtrl.setRoot(Home2Page) }
          if (this.config.homePage == 3) { this.navCtrl.setRoot(Home3Page) }
          if (this.config.homePage == 4) { this.navCtrl.setRoot(Home4Page) }
          if (this.config.homePage == 5) { this.navCtrl.setRoot(Home5Page) }
          setTimeout(() => {
            this.splashScreen.hide();
          }, 700);
          this.st.set('firsttimeApp', 'firstTime');
        });
        if (this.plt.is('ios')) {
          if (this.config.admobIos == 1) this.initializeAdmob(this.config.admobBanneridIos, this.config.admobIntidIos);
          this.config.admob = this.config.admobIos;
        } else if (this.plt.is('android')) {
          if (this.config.admob == 1) this.initializeAdmob(this.config.admobBannerid, this.config.admobIntid);
        }
        //subscribe for push notifiation
        this.st.get('pushNotification').then((val) => {
          if (val == undefined) {
            this.shared.subscribePush();
            this.st.set('pushNotification', "loaded");
          }
        });
      });

      this.statusBar.styleLightContent();

    });
  }

  initializeAdmob(bannerId, intId) {
    if (this.platform.is('cordova')) {
      const bannerConfig: AdMobFreeBannerConfig = {
        id: bannerId,
        isTesting: false,
        autoShow: true
      };
      this.admobFree.banner.config(bannerConfig);

      this.admobFree.banner.prepare()
        .then(() => {
        })
        .catch(e => console.log(e));

      const interstitialConfig: AdMobFreeInterstitialConfig = {
        id: intId,
        isTesting: false,
        autoShow: true
      };
      this.admobFree.interstitial.config(interstitialConfig);
      this.admobFree.interstitial.prepare();
    }
  }
  //creating new account using function facebook or google details 
  createAccount(info, type) {
    
    this.loading.show();
    var dat: { [k: string]: any } = {};
    var url = '';

    if (type == 'fb') {

      url = 'facebookregistration';
      dat.access_token = info;

    }
    else {

      url = 'googleregistration';
      dat = info;
    }
   
    this.httpClient.post(this.config.url + url, dat).subscribe((data: any) => {
      this.loading.hide();
    
      if (data.success == 1) {
  
        this.shared.login(data.data[0]);
        this.navCtrl.setRoot(HomePage);

      }
      else if (data.success == 2) {
  
        this.shared.login(data.data[0]);
        this.navCtrl.setRoot(HomePage);
      }

    }, error => {
      this.loading.hide();
      // console.log("error " + JSON.stringify(error));
    });
  };
  //close modal
  dismiss() {
    this.viewCtrl.dismiss();
    this.shared.currentOpenedModel = null;
  }

}
