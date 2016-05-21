'use strict';

const EmailMessages = (function() {

  const _FROM_ADDRESS = "grades.app.noreply@gmail.com";

  const _getIdentityConfirmationMessage = (toAddress, identitySecret) => {
    return {
      subject: "Identity confirmation",

      text: "Hello! An attempt has been made to register this account within Grades Application. \n"
        + `The identity confirmation code is the following: ${identitySecret}`,

      from: _FROM_ADDRESS,
      to:  toAddress,

      attachment: [
        {
          data: "Hello! An attempt has been made to register this account within Grades Application. \n"
          + `The identity confirmation code is the following: <strong>${identitySecret}</strong>`,

          alternative: true
        }
      ]
    }
  };

  return ({
    getIdentityConfirmationMessage: _getIdentityConfirmationMessage
  })
})();

module.exports = EmailMessages;