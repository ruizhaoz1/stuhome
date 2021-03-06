import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import SettingItem from '~/components/SettingItem/SettingItem';
import FONT_SIZES from '~/constants/fontSize';
import * as configs from '~/config/app';
import { storeSettingsToStorage } from '~/modules/settings/settings.ducks';

import mainStyles from '~/common/styles/Main.style';
import settingsStyles from '~/containers/Settings/Settings.style';
import settingsItemStyles from '~/components/SettingItem/SettingItem.style';
import styles from '~/containers/SettingsFontSize/SettingsFontSize.style';

class SettingsFontSize extends Component {
  static navigationOptions = {
    title: '阅读字号'
  }

  storeFontSize(fontSize) {
    this.props.storeSettingsToStorage({ fontSize });
  }

  render() {
    const { settings, navigation } = this.props;
    const { fontSize, lineHeight } = FONT_SIZES[settings.fontSize];
    const fontStyle = {
      fontSize,
      lineHeight
    };
    const authorLink = (
      <Text
        style={styles.url}
        onPress={() => navigation.navigate('Individual', {
          userId: configs.AUTHOR_ID,
          userName: configs.AUTHOR_NAME
        })}>
        {`@${configs.AUTHOR_NAME}`}
      </Text>
    );

    return (
      <View style={[mainStyles.container, styles.container]}>
        <View style={settingsStyles.group}>
          {Object.keys(FONT_SIZES).map((key, index) => (
            <SettingItem
              key={index}
              text={FONT_SIZES[key].text}
              onPress={() => this.storeFontSize(key)}>
              <Text style={settingsItemStyles.indicator}>
                {settings.fontSize === key && <Icon style={styles.check} name='check' />}
              </Text>
            </SettingItem>
          ))}
        </View>
        <View style={[settingsStyles.group, styles.demo]}>
          <Text style={[styles.text, fontStyle]}>
            这款 App 是由畔友 {authorLink} 利用业余时间，用编程语言 JavaScript 完成的。
            App 不仅一直保持开源，也一直坚持着代码结构的整洁与最新技术的引入。
          </Text>
          <Text style={[styles.text, fontStyle, { marginTop: 10 }]}>
            This App was created by {authorLink} in spare time with JavaScript.
            The App is still keeping open source, while also keeping code structure
            clean as well as introducing latest tech stack.
          </Text>
        </View>
      </View>
    );
  }
}

function mapStateToProps({ settings }) {
  return {
    settings
  };
}

export default connect(mapStateToProps, {
  storeSettingsToStorage
})(SettingsFontSize);
