import * as actions from './actions';

const initialState = {
  userSession: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.LOGGEDIN:
      return {
        ...state,
        userSession: action.userSession,
      };
    default:
      return state;
  }
};
export default rootReducer;
