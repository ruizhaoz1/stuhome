import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import ForumItems from '~/components/ForumItems/ForumItems';
import Header from '~/components/Header/Header';
import { invalidateForumList, fetchForumList } from '~/modules/forum/forumList.ducks';

import mainStyles from '~/common/styles/Main.style';
import modalStyles from '~/common/styles/Modal.style';

class ForumListModal extends Component {
  constructor(props) {
    super(props);
    this.title = '请选择版块';
    this.boardId = 'all';
  }

  componentDidMount() {
    this.fetchForumList();
  }

  fetchForumList() {
    this.props.fetchForumList({
      boardId: this.boardId
    });
  }

  refreshForumList() {
    this.props.invalidateForumList({
      boardId: this.boardId
    });
    this.fetchForumList();
  }

  handleSelectForum(forum) {
    const { navigation } = this.props;
    navigation.navigate('PublishModal', {
      boardId: forum.board_id
    });
  }

  render() {
    const { forumList, navigation } = this.props;

    return (
      <View style={mainStyles.container}>
        <Header title={this.title}>
          <Text
            style={modalStyles.button}
            onPress={() => navigation.goBack()}>取消</Text>
        </Header>
        <ForumItems
          isForumListModal={true}
          boardId={'all'}
          forumList={forumList}
          isTopForumList={true}
          handleSelectForum={(forum) => this.handleSelectForum(forum)}
          refreshForumList={() => this.refreshForumList()} />
      </View>
    );
  }
}

function mapStateToProps({ forumList }) {
  return {
    forumList: _.get(forumList, 'all', {})
  };
}

export default connect(mapStateToProps, {
  invalidateForumList,
  fetchForumList
})(ForumListModal);
