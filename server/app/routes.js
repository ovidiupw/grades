'use strict';

const Errors = require('./constants/errors');
const Error = require('./modules/error');

const RouteNames = require('./constants/routes');

const RegisterIdentity = require('./route_handlers/registrations/RegisterIdentity');
const AddNewRole = require('./route_handlers/roles/AddNewRole');
const ListRoles = require('./route_handlers/roles/ListRoles');
const AddNewStudent = require('./route_handlers/students/AddNewStudent');
const DeleteStudent = require('./route_handlers/students/DeleteStudent');
const AddNewProfessor = require('./route_handlers/professors/AddNewProfessor');
const DeleteProfessor = require('./route_handlers/professors/DeleteProfessor');
const ConfirmIdentity = require('./route_handlers/registrations/ConfirmIdentity');
const AddNewRegistration = require('./route_handlers/registrations/AddNewRegistration');
const ListRegistrations = require('./route_handlers/registrations/ListRegistrations');
const DeleteRegistration = require('./route_handlers/registrations/DeleteRegistration');
const ListApiResources = require('./route_handlers/resources/ListApiResources');


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
   * This function handles deleting a registration from the database.
   */
  app.get(RouteNames.API_RESOURCES, function(req, res) {
    ListApiResources.invoke(req, res);
  });


  /**
   * This function handles deleting a registration from the database.
   */
  app.delete(RouteNames.REGISTRATIONS, function(req, res) {
    DeleteRegistration.invoke(req, res);
  });

  /**
   * This function handles listing all registrations from the database.
   */
  app.get(RouteNames.REGISTRATIONS, function(req, res) {
    ListRegistrations.invoke(req, res);
  });

  /**
   * This function handles creating a new registration in the database.
   */
  app.post(RouteNames.REGISTRATIONS, function (req, res) {
    AddNewRegistration.invoke(req, res);
  });

  /**
   * This function handles listing all roles from the database.
   */
  app.get(RouteNames.ROLES, function(req, res) {
    ListRoles.invoke(req, res);
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

  app.delete(RouteNames.STUDENTS, function (req, res) {
    DeleteStudent.invoke(req, res);
  });

  /**
   * This function handles adding a new professor.
   */
  app.post(RouteNames.PROFESSORS, function (req, res) {
    AddNewProfessor.invoke(req, res);
  });

  app.delete(RouteNames.PROFESSORS, function (req, res) {
    DeleteProfessor.invoke(req, res);
  });

  /* Authentication via facebook */
  app.get(RouteNames.AUTH_FACEBOOK,
    passport.authenticate('facebook', {
      authType: 'rerequest',
      session: false
    })
  );

  let getAuthResponse = function (urlPayload) {
    return `
    <html><body>
      <script>
      window.opener.location = 'http://localhost:3000/login-redirect?${urlPayload}';
      </script>
    </body></html>
    `;
  };

  app.get(RouteNames.AUTH_FACEBOOK_CALLBACK,
    passport.authenticate('facebook', {
      session: false
    }),
    function (req, res) {
      // Authentication succeeded, send auth data to user.
      res.status(200);
      res.send(getAuthResponse(JSON.stringify(req.user)));
    },
    function (err, req, res, next) {
      if (err) {
        // Authentication failed, send auth error data to user.
        res.status(400);
        const error = new Error(
          Errors.AUTHENTICATION_ERROR.id,
          Errors.AUTHENTICATION_ERROR.message,
          encodeURIComponent(err.code + " - " + err.message + " - " + err.data));

        res.send(getAuthResponse(JSON.stringify(error)));
      }
    }
  );

  app.get("/", function (req, res) {
    res.status(404);
    res.send();
  });

};

module.exports = Routes;
