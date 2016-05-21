'use strict';

let User = require('./entities/user');

const Errors = require('./constants/errors');
const Error = require('./modules/error');

const RouteNames = require('./constants/routes');

const RegisterIdentity = require('./route_handlers/registrations/RegisterIdentity');
const AddNewRole = require('./route_handlers/roles/AddNewRole');
const AddNewStudent = require('./route_handlers/students/AddNewStudent');
const DeleteStudent = require('./route_handlers/students/DeleteStudent');
const AddNewProfessor = require('./route_handlers/professors/AddNewProfessor');
const DeleteProfessor = require('./route_handlers/professors/DeleteProfessor');
const ConfirmIdentity = require('./route_handlers/registrations/ConfirmIdentity');
const AddNewRegistration = require('./route_handlers/registrations/AddNewRegistration');

let Routes = function (app, passport) {

  app.get(RouteNames.ROOT, function (req, res) {
    let response = {
      'api_version': 'v1',
      'last_update_date': 'May 2016'
    };
    res.status(200);
    res.send(response);
  });

  /**
   * This function handles creating a new registration in the database.
   */
  app.post(RouteNames.REGISTRATIONS, function (req, res) {
    let pathGroup = RouteNames.REGISTRATIONS.exec(req.url);
    console.log(pathGroup);
    //TODO continue work
    AddNewRegistration.invoke(req, res, data);
  });

  /**
   * This function handles adding a new role (specification) in the database.
   */
  app.post(RouteNames.ROLES, function (req, res) {
    AddNewRole.invoke(req, res);
  });

  /**
   * This function handles confirming a previously registered identity.
   */
  app.put(RouteNames.REGISTER_IDENTITY, function (req, res) {
    ConfirmIdentity.invoke(req, res);
  });

  /**
   * This function handles registering a new faculty identity.
   */
  app.post(RouteNames.REGISTER_IDENTITY, function (req, res) {
    RegisterIdentity.invoke(req, res);
  });

  /**
   * This function handles adding a new student.
   */
  app.post(RouteNames.STUDENTS, function (req, res) {
    AddNewStudent.invoke(req, res);
  });
  
  app.delete(RouteNames.STUDENTS, function(req, res) {
    DeleteStudent.invoke(req, res);
  });

  /**
   * This function handles adding a new professor.
   */
  app.post(RouteNames.PROFESSORS, function (req, res) {
    AddNewProfessor.invoke(req, res);
  });

  app.delete(RouteNames.PROFESSORS, function(req, res) {
    DeleteProfessor.invoke(req, res);
  });

  /* Authentication via facebook */
  app.get(RouteNames.AUTH_FACEBOOK,
    passport.authenticate('facebook', {
      authType: 'rerequest',
      session: false
    })
  );

  app.get(RouteNames.AUTH_FACEBOOK_CALLBACK,
    passport.authenticate('facebook', {session: false, failureRedirect: '/'}),
    function (req, res) {
      // Authentication succeeded, send auth data to user.
      res.status(200);
      res.send({
        profile: req.user
      });
    },
    function (err, req, res, next) {
      if (err) {
        // Authentication failed, send auth error data to user.
        res.status(400);
        res.send(new Error(
          Errors.AUTHENTICATION_ERROR.id,
          Errors.AUTHENTICATION_ERROR.message,
          err.message
        ));
      }
    }
  );

  app.get("/", function (req, res) {
    res.status(404);
    res.send();
  });

};

module.exports = Routes;
