import {
  updateError,
  showDangerAlert
} from '../actions/actions';

import {DEVELOPER} from '../constants/facultyStatuses';

let Utility = {
  userAccountIsComplete: function (authResponse) {
    if (authResponse.facultyIdentity == undefined)
      return false;
    if (authResponse.identityConfirmed !== true)
      return false;

    return true;
  },

  handleResponseCodeNot200: function (response, dispatch) {
    if (response.status.code === 400) {
      dispatch(updateError({
        message: response.entity.message + " - " + response.entity.data
      }));
    } else {
      dispatch(updateError({
        message: response.status.text
      }));
    }
    dispatch(showDangerAlert());
  },

  getRedirectLocation: function (facultyStatuses) {
    if (facultyStatuses.indexOf(DEVELOPER) != -1) {
      return "/developer/home";
    }
  }
};

export default Utility;