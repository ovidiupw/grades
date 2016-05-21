/**
 * Created by Ovidiu on 5/21/2016.
 */
'use strict';

let Utility = (function() {

  /**
   * This function takes an object and builds a string representation
   * of the object's first-level (as of nesting) keys, separated by comma.
   *
   * @param object The object of which keys to be appended to the newly created string
   * @returns {string} A string of comma separated object keys
   * @private
   */
  const _buildCommaSeparatedKeysString = function (object, separator) {
    let commaSeparatedKeys = '';
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        commaSeparatedKeys += `${object[key]}${separator}`
      }
    }
    return  commaSeparatedKeys.substring(0, commaSeparatedKeys.length - 1);
  };

  return {
    buildDelimiterSeparatedObjectKeys: _buildCommaSeparatedKeysString
  }
})();

module.exports = Utility;