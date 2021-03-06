'use strict';

const Errors = require('./constants/errors');
const Error = require('./modules/error');

const RouteNames = require('./constants/routes');

const RegisterIdentity = require('./route_handlers/registrations/RegisterIdentity');
const AddNewRole = require('./route_handlers/roles/AddNewRole');
const ListRoles = require('./route_handlers/roles/ListRoles');
const AddNewStudent = require('./route_handlers/students/AddNewStudent');
const DeleteStudent = require('./route_handlers/students/DeleteStudent');
const ListStudents = require('./route_handlers/students/ListStudents');
const AddNewProfessor = require('./route_handlers/professors/AddNewProfessor');
const DeleteProfessor = require('./route_handlers/professors/DeleteProfessor');
const ListProfessors = require('./route_handlers/professors/ListProfessors');
const AddCourse = require('./route_handlers/courses/AddCourse');
const DeleteCourse = require('./route_handlers/courses/DeleteCourse');
const ListCourses = require('./route_handlers/courses/ListCourses');

const ConfirmIdentity = require('./route_handlers/registrations/ConfirmIdentity');
const AddNewRegistration = require('./route_handlers/registrations/AddNewRegistration');
const DeleteRegistration = require('./route_handlers/registrations/DeleteRegistration');
const ListApiResources = require('./route_handlers/resources/ListApiResources');
const ListRegistrations = require('./route_handlers/registrations/ListRegistrations');
const AddNewModule = require('./route_handlers/modules/AddNewModule');
const DeleteModule = require('./route_handlers/modules/DeleteModule');

const ExportStudentsCsv = require('./route_handlers/csv/ExportStudentsCsv');
const ExportProfessorsCsv = require('./route_handlers/csv/ExportProfessorsCsv');
const ImportStudentsCsv = require('./route_handlers/csv/ImportStudentsCsv');
const ImportProfessorsCsv = require('./route_handlers/csv/ImportProfessorsCsv');

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
   * This function handles csv export from students collection.
   */
  app.get(RouteNames.STUDENTS_CSV, function(req, res) {
    ExportStudentsCsv.invoke(req, res);
  });

  /**
   * This function handles csv export from professors collection.
   */
  app.get(RouteNames.PROFESSORS_CSV, function(req, res) {
    ExportProfessorsCsv.invoke(req, res);
  });

  /**
   * This function handles csv import to students collection.
   */
  app.post(RouteNames.STUDENTS_CSV, function(req, res) {
    ImportStudentsCsv.invoke(req, res);
  });

  /**
   * This function handles csv import to professors collection.
   */
  app.post(RouteNames.PROFESSORS_CSV, function(req, res) {
    ImportProfessorsCsv.invoke(req, res);
  });

  /**
   * This function handles listing API resources from the database.
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

  /**
   * This function handles deleting a student.
   */
  app.delete(RouteNames.STUDENTS, function (req, res) {
    DeleteStudent.invoke(req, res);
  });

  /**
   * This function handles getting a list of all the students in the database.
   */
  app.get(RouteNames.STUDENTS, function (req, res) {
    ListStudents.invoke(req, res);
  });

  /**
   * This function handles adding a new module.
   */
  app.post(RouteNames.MODULES, function (req, res) {
    AddNewModule.invoke(req, res);
  });

  /**
   * This function handles deleting a module.
   */
  app.delete(RouteNames.MODULES, function (req, res) {
    DeleteModule.invoke(req, res);
  });

  /**
   * This function handles adding a new professor.
   */
  app.post(RouteNames.PROFESSORS, function (req, res) {
    AddNewProfessor.invoke(req, res);
  });

  /**
   * This function handles deleting a professor.
   */
  app.delete(RouteNames.PROFESSORS, function (req, res) {
    DeleteProfessor.invoke(req, res);
  });

	/**
     * This function handles adding a new course.
     */
    app.post(RouteNames.COURSES, function (req, res) {
        AddCourse.invoke(req, res);
    });

    app.get(RouteNames.COURSES, function (req, res) {
        ListCourses.invoke(req, res);
    });
    
    app.delete(RouteNames.COURSES, function (req, res) {
        DeleteCourse.invoke(req, res);
    });

  /**
   * This function handles getting a list of all the professors in the database.
   */
  app.get(RouteNames.PROFESSORS, function (req, res) {
    ListProfessors.invoke(req, res);
  });

  /* Authentication via facebook */
  app.get(RouteNames.AUTH_FACEBOOK, function(req, res) {
    passport.authenticate('facebook', {
      authType: 'rerequest',
      session: false,
      state: req.query.redirectUrl
    })(req, res)
  });


  let getAuthResponse = function (redirectUrl, urlPayload) {
    let windowOpenerLocation = redirectUrl + '?' + urlPayload;
    return `
    <html><body>
      <script>
      window.opener.location = '${windowOpenerLocation}';
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
      if (req.user.redirectUrl == undefined) {
        res.status(400);
        res.send(new Error(
          Errors.AUTHENTICATION_ERROR.id,
          Errors.AUTHENTICATION_ERROR.message,
          'A redirect url was not supplied.'
        ));
      } /*else if (req.user.redirectUrl.substr(0,6) != 'https://') {
        res.status(400);
        res.send(new Error(
          Errors.AUTHENTICATION_ERROR.id,
          Errors.AUTHENTICATION_ERROR.message,
          'The redirect url must be a https:// address.'
        ));
      } */else {
        res.status(200);
        res.send(getAuthResponse(req.user.redirectUrl, JSON.stringify(req.user)));
      }
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
