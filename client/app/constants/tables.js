export const SpecialColumns = {
  DELETE_BUTTON: "DELETE_BUTTON"
};

export const REGISTRATIONS_COLUMNS = [
  'facultyIdentity',
  'roles',
  'facultyStatus',
  SpecialColumns.DELETE_BUTTON
];

export const REGISTRATIONS_COLUMN_NAMES = {
  'facultyIdentity' : 'Faculty Identity',
  'roles': 'Application roles',
  'facultyStatus': 'Faculty Statuses',
  'DELETE_BUTTON': 'Modify' // SpecialColumns.DELETE_BUTTON
};

/***************************/

export const ROLES_COLUMNS = [
  'title',
  'actions'
];

export const ROLES_COLUMN_NAMES = {
  'title': 'Title',
  'actions': 'Actions'
};