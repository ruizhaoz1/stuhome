import _ from 'lodash';
import {
  RESET,
  REQUEST_STARTED,
  REQUEST_COMPELTED,
  REQUEST_FAILED
} from '../../actions/message/alertAction';

const defaultAlertState = {
  isFetching: false,
  response: null
};

export default function alert(state = defaultAlertState, action) {
  switch (action.type) {
    case REQUEST_STARTED: {
      return {
        ...state,
        isFetching: true
      };
    }
    case REQUEST_COMPELTED:
      return {
        ...state,
        isFetching: false,
        response: action.payload.body
      };
    case REQUEST_FAILED: {
      return {
        ...state,
        isFetching: false,
      };
    }
    case RESET:
      return defaultAlertState;
    default:
      return state;
  }
}
