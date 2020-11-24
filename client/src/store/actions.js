export const LOGGEDIN = 'LOGGEDIN';
export const loggedIn = userSession => dispatch => {
  dispatch({ type: LOGGEDIN, userSession });
};
