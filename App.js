import React, { Component } from 'react';
import {
  BackHandler,
  View,
  StatusBar,
  Image,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';

const windowHeight = Dimensions.get('window').height;

export default class App extends Component {
  WEBVIEW_REF = React.createRef();

  state = {
    canGoBack: false,
    isLoading: true,
    loader: false,
    baseUrl: 'https://haragkom.com/',
    url: 'https://haragkom.com/',
  };
  
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (frames) => {
        if (!frames.endCoordinates) return;

        this.setState({
          keyboardSpace: windowHeight - frames.endCoordinates.height,
        });
      },
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      (frames) => {
        this.setState({ keyboardSpace: 0 });
      },
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    console.log('canGoBack bf if', this.state.canGoBack);
    if (this.state.canGoBack) {
      // this.WEBVIEW_REF.current.goBack();
      this.setState({ url: 'https://haragkom.com/' });
      return true;
    } else {
      // this.WEBVIEW_REF.current.goBack();

      return false;
    }
  };

  onNavigationStateChange = (navState) => {
    this.setState({
      canGoBack:
        this.state.url == 'https://haragkom.com/' ? false : navState.canGoBack,
    });
  };

  render() {
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 3000);

    return (
      <>
        <StatusBar hidden />

        <View
          style={{
            height:
              this.state.isLoading == false
                ? !this.state.keyboardSpace
                  ? windowHeight
                  : this.state.keyboardSpace
                : 0,
          }}>
          <WebView
            style={{}}
            source={{ uri: this.state.url }}
            ref={this.WEBVIEW_REF}
            onNavigationStateChange={this.onNavigationStateChange}
            onLoadStart={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              this.isLoading = nativeEvent.loading;
              this.setState({ loader: this.isLoading });
            }}
            onLoad={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              this.currentUrl = nativeEvent.url;
              this.state.baseUrl != this.currentUrl
                ? (this.setState({ loader: false }),
                  this.setState({ url: this.currentUrl }))
                : this.setState({ loader: false });
            }}
            // onLoadEnd={(syntheticEvent) => {
            //   const { nativeEvent } = syntheticEvent;
            //   this.isLoading = nativeEvent.loading;
            //   this.setState({ loader: this.isLoading });
            // }}
          />

          {this.state.loader == true && (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
        </View>

        {this.state.isLoading == true && (
          <View style={{ height: windowHeight, backgroundColor: '#fff' }}>
            <Image
              source={require('./assets/Haragkom.gif')}
              style={{ width: '70%', height: '100%', alignSelf: 'center' }}
              resizeMode="contain"
            />
          </View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  loader: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: 'absolute',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
