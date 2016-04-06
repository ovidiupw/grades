'use strict';

const SchemaConstraints = {
  facultyIdentityMinLength: 3,
  facultyIdentityMaxLength: 255,
  apiKeyMinLength: 64,
  apiKeyMaxLength: 1024,
  userMinLength: 1,
  userMaxLength: 128,
  identitySecretMinLength: 4,
  identitySecretMaxLength: 12
};

module.exports = SchemaConstraints;
