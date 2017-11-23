import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Navigator } from 'react-native';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import SideMenu from 'react-native-side-menu';
import Router from '../router';
import Menu from './Menu';
import Home from './Home';
import { fetchAlerts } from '../actions/message/alertAction';

class RNavigator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  componentDidMount() {
    MessageBarManager.registerMessageBar(this.refs.alert);
    this.timer = setInterval(() => { this._fetchAlerts(); }, 1000 * 5);
  }

  componentWillUnmount() {
    MessageBarManager.unregisterMessageBar();
    this.timer && clearInterval(this.timer);
  }

  _fetchAlerts() {
    this.props.fetchAlerts();
  }

  configureScene(route) {
    if (route.sceneConfig) {
      return route.sceneConfig;
    }

    return Navigator.SceneConfigs.FloatFromRight;
  }

  renderScene(route, navigator) {
    if (!this.router) {
      this.router = new Router(navigator);
    }

    return <route.component
             router={this.router}
             updateMenuState={isOpen => this._updateMenuState(isOpen)}
             passProps={route.passProps} />;
  }

  _updateMenuState(isOpen) {
    this.setState({ isOpen });
  }

  _onMenuItemSelected(item, isForceReplace) {
    this._updateMenuState(false);
    this.router[item.actionName](isForceReplace);
  }

  _isCurrentRoute(route) {
    return this.router && this.router.isCurrentRoute(route.id);
  }

  render() {
    let menu = <Menu
                 selectMenuItem={(item, isForceReplace) => this._onMenuItemSelected(item, isForceReplace)}
                 isCurrentRoute={route => this._isCurrentRoute(route)} />;

    return (
      <SideMenu
        menu={menu}
        disableGestures={true}
        isOpen={this.state.isOpen}>
        <Navigator
          ref='navigator'
          configureScene={this.configureScene}
          renderScene={this.renderScene.bind(this)}
          initialRoute={{
            id: 'home',
            title: '首页',
            component: Home
          }} />
        <MessageBar ref="alert" />
      </SideMenu>
    );
  }
}

export default connect(null, {
  fetchAlerts
})(RNavigator);
