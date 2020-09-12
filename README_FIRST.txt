
Common issue with compiling the app


FOR ANDROID

1. after compile if the app stays on splash screen and the api is working
when you test on admin panel and your site has SSL
or yous api link starts with https://

do the following

open the file package.json  remove the following

"cordova-plugin-ionic-webview": "4.2.1",

and

"cordova-plugin-ionic-webview": {},


this plugin is mainly use for iOS to use wkwebview instead of uiwebview 
so make sure when compiling the app in iOS this plugin exists in your package.json


================================================================================================



FOR IOS / APPLE


common rejection in apple are  
ITMS-90809: UIWebView API Deprecation 


when compiling the app to iOS do the following

1. 

in package.json

remove the following plugin 

"cordova-plugin-dialogs": "git+https://github.com/dpa99c/cordova-plugin-dialogs.git",
"cordova-plugin-enable-multidex": "^0.2.0",

and

"cordova-plugin-dialogs": {},
"cordova-plugin-enable-multidex": {},


make sure that the plugin  cordova-plugin-ionic-webview is in your package.json

"cordova-plugin-ionic-webview": "4.2.1",
and
"cordova-plugin-ionic-webview": {},

3. make sure that this line is in your config.xml
this will be lost or replace by monaca if you go to ios settings and saved

  <preference name="WKWebViewOnly" value="true"/>
    <feature name="CDVWKWebViewEngine">
      <param name="ios-package" value="CDVWKWebViewEngine"/>
    </feature>
    <preference name="CordovaWebViewEngine" value="CDVWKWebViewEngine"/>

4. lastly make sure you choose IOS 5.1.1 and  Xcode 11.3 
under monaca build environment before compiling the app in iOS

this is needed cause apple will look for the app build
in there latest sdk

see screenshot 
https://imgur.com/a/VJAmA2B


