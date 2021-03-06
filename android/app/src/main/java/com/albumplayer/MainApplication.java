package com.albumplayer;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.bolan9999.SpringScrollViewPackage;
import com.lufinkey.react.spotify.RNSpotifyPackage;
import com.lufinkey.react.eventemitter.RNEventEmitterPackage;
import com.guichaguri.trackplayer.TrackPlayer;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.cinder92.musicfiles.RNReactNativeGetMusicFilesPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new AsyncStoragePackage(),
            new SpringScrollViewPackage(),
            new RNSpotifyPackage(),
            new RNEventEmitterPackage(),
            new TrackPlayer(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage(),
            new RNReactNativeGetMusicFilesPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
