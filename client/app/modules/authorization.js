let Authorization = {
  saveCredentialsToLocalStorage: function(userCredentials) {
    if (!userCredentials.hasOwnProperty('user')
      || !userCredentials.hasOwnProperty('apiKey')
      || !userCredentials.hasOwnProperty('keyExpires')
      || !userCredentials.hasOwnProperty('facultyStatus')) {
      throw 'Invalid user-credentials object.';
    }
    
    localStorage.setItem('user', userCredentials.user);
    localStorage.setItem('apiKey', userCredentials.apiKey);
    localStorage.setItem('keyExpires', userCredentials.keyExpires);
    localStorage.setItem('facultyStatus', userCredentials.facultyStatus);
  },

  loadCredentialsFromLocalStorage: function() {
    return {
      user: localStorage.getItem('user'),
      apiKey: localStorage.getItem('apiKey'),
      keyExpires: localStorage.getItem('keyExpires'),
      facultyStatus: localStorage.getItem('facultyStatus')
    }
  }
};

export default Authorization;