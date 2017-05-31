import {
  updateError,
  showDangerAlert
} from '../actions/actions';
import {SESSION_PROBLEM} from '../constants/routes'
import React from 'react'
import * as InitialStates from '../constants/initialStates'

import {DEVELOPER, STUDENT, PROFESSOR, SECRETARY} from '../constants/facultyStatuses';

let Utility = {
  initFacebook: function() {
    FB.init({
        appId      : '339198119829864',
        cookie     : false,
        xfbml      : true,
        version    : 'v2.8'
      });
    FB.AppEvents.logPageView();
  },

  userAccountIsComplete: function (authResponse) {
    if (authResponse.facultyIdentity == undefined)
      return false;
    if (authResponse.identityConfirmed !== true)
      return false;

    return true;
  },

  handleResponseCodeNot200: function (response, dispatch) {
    if (response.status.code === 400) {
      let data = response.entity.data;

      if (response.entity.code === 6 || response.entity.code === 7) {
        data = "Go to home-screen by clicking the top left 'Grades' logo and login again."
      }
      if (response.entity.errors != undefined) {
        data = JSON.stringify(response.entity.errors);
      }
      if (response.entity.errmsg != undefined) {
        data = JSON.stringify(response.entity.errmsg);
      }

      dispatch(updateError({
        message: response.entity.message + " - " + JSON.stringify(data)
      }));
    } else {
      dispatch(updateError({
        message: response.status.text
      }));
    }
    dispatch(showDangerAlert());
  },

  getRedirectLocation: function (facultyStatuses) {
    if (facultyStatuses.indexOf(SECRETARY) != -1) {
      return "/secretary/home";
    }
    if (facultyStatuses.indexOf(DEVELOPER) != -1) {
      return "/developer/home";
    }
    if (facultyStatuses.indexOf(PROFESSOR) != -1) {
      return "/professor/home";
    }
    if (facultyStatuses.indexOf(STUDENT) != -1) {
      return "/student/home";
    }
  },

  redirectOnSessionProblem: function (userAccount, router) {
    if (userAccount.user == undefined
      || userAccount.apiKey == undefined
      || userAccount.keyExpires == undefined
      || new Date(userAccount.keyExpires) <= new Date()) {
      router.push(SESSION_PROBLEM);
    }
  },

  getHtmlRoleDescription: function (role) {
    return `<h4>${role.title}</h4> <p>This role has permissions to:</p><ul>`
      + role.actions.map(action => `<li>${action.verb} on '${action.resource}'</li>`)
      + '</ul>'
  },

  persistAddRegistrationForm: function (addRegistrationForm) {
    localStorage.setItem('addRegistrationForm', JSON.stringify(addRegistrationForm));
  },

  getPersistedAddRegistrationForm: function () {
    try {
      if (localStorage.getItem('addRegistrationForm') == undefined) throw 'No persisted addRegistrationForm found.';
      let persistedAddRegistrationForm = JSON.parse(localStorage.getItem('addRegistrationForm'));
      return persistedAddRegistrationForm;
    } catch (err) {
      console.log(err);
      return InitialStates.addRegistrationForm;
    }
  },

  persistAddRoleForm: function(addRoleForm) {
    localStorage.setItem('addRoleForm', JSON.stringify(addRoleForm));
  },

  getPersistedAddRoleForm: function() {
    try {
      if (localStorage.getItem('addRoleForm') == undefined) throw 'No persisted addRoleForm found.';
      let persistedAddRoleForm = JSON.parse(localStorage.getItem('addRoleForm'));
      return persistedAddRoleForm;
    } catch (err) {
      console.log(err);
      return InitialStates.addRoleForm;
    }
  }

};

export default Utility;
