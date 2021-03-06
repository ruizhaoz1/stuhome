import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { HeaderBackButton } from 'react-navigation';
import TopicList from '~/components/TopicList/TopicList';
import { invalidateUserTopicList, fetchUserTopicList } from '~/modules/user/userTopicList/userTopicList.ducks';
import { AVATAR_ROOT } from '~/config/app';

import scrollableTabViewStyles from '~/common/styles/ScrollableTabView.style';
import headerRightButtonStyles from '~/common/styles/HeaderRightButton.style';
import mainStyles from '~/common/styles/Main.style';
import colors from '~/common/styles/colors.style';
import styles from './Individual.style';

class Individual extends Component {
  static navigationOptions = ({ navigation }) => {
    const { userId, isLoginUser } = _.get(navigation, ['state', 'params'], {});
    return {
      headerStyle: {
        backgroundColor: colors.lightBlue,
        borderBottomWidth: 0
      },
      headerRight: (
        isLoginUser === false &&
          <Icon
            style={headerRightButtonStyles.button}
            name='envelope'
            size={18}
            onPress={() => navigation.navigate('PrivateMessage', { userId })} />
      )
    };
  }

  constructor(props) {
    super(props);
    this.initTabsAndUserInformation();
  }

  initTabsAndUserInformation() {
    this.TABS = [];

    const {
      session,
      navigation: {
        state: {
          params: passProps
        }
      }
    } = this.props;
    this.isLoginUser = !passProps || (+passProps.userId === session.data.uid);

    if (this.isLoginUser) {
      const {
        session: {
          data: {
            uid,
            userName,
            avatar
          }
        },
      } = this.props;
      this.userId = uid;
      this.userName = userName;
      this.userAvatar = avatar;
      // User could only see their own favorite topics since it's privacy.
      this.TABS = [
        { label: '最近发表', type: 'topic' },
        { label: '最近回复', type: 'reply' },
        { label: '我的收藏', type: 'favorite' }
      ];
    } else {
      const {
        userId,
        userName,
        userAvatar
      } = passProps;
      this.userId = userId;
      this.userName = userName;
      // If user comes from @somebody link, we could not get his/her avatar directly.
      this.userAvatar = userAvatar || `${AVATAR_ROOT}&uid=${userId}`;

      this.TABS = [
        { label: 'TA的发表', type: 'topic' },
        { label: 'TA的回复', type: 'reply' },
      ];
    }
  }

  componentDidMount() {
    this.props.fetchUserTopicList({
      userId: this.userId,
      isEndReached: false,
      type: 'topic'
    });
    // Display private message button or not.
    this.props.navigation.setParams({
      userId: this.userId,
      isLoginUser: this.isLoginUser
    });
  }

  refreshUserTopicList({ page, isEndReached, type }) {
    this.props.invalidateUserTopicList({
      userId: this.userId,
      type
    });
    this.props.fetchUserTopicList({
      userId: this.userId,
      isEndReached,
      type,
      page
    });
  }

  changeTab(e) {
    this.props.fetchUserTopicList({
      userId: this.userId,
      isEndReached: false,
      type: this.TABS[e.i].type
    });
  }

  render() {
    const {
      navigation,
      userTopicList,
      settings
    } = this.props;

    return (
      <View style={mainStyles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Information', { userId: this.userId });
            }}>
            <Image
              style={styles.avatar}
              source={{ uri: this.userAvatar }} />
          </TouchableOpacity>
          <Text style={styles.userName}>{this.userName}</Text>
        </View>
        <ScrollableTabView
          tabBarActiveTextColor={colors.blue}
          tabBarInactiveTextColor={colors.lightBlue}
          tabBarUnderlineStyle={scrollableTabViewStyles.tabBarUnderline}
          tabBarTextStyle={scrollableTabViewStyles.tabBarText}
          onChangeTab={e => this.changeTab(e)}>
          {this.TABS.map((tab, index) => {
            return (
              <TopicList
                key={index}
                currentUserId={this.userId}
                tabLabel={tab.label}
                navigation={navigation}
                settings={settings}
                type={tab.type}
                topicList={_.get(userTopicList, [this.userId, tab.type], {})}
                refreshTopicList={({ page, isEndReached }) => this.refreshUserTopicList({ page, isEndReached, type: tab.type })} />
            );
          })}
        </ScrollableTabView>
      </View>
    );
  }
}

function mapStateToProps({ session, userTopicList, settings }) {
  return {
    session,
    userTopicList,
    settings
  };
}

export default connect(mapStateToProps, {
  invalidateUserTopicList,
  fetchUserTopicList
})(Individual);
