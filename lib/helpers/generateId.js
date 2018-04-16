var defaultAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
    hexidecimal     = '0123456789abcdef',
    utils           = require('js-data').utils;

/**
 * Generates a random character from the given alphabet
 *
 * @param {string} [alphabet]  The list of characters that you allow to generate. Defaults to url-safe base64
 *
 * @returns {string}
 */
function randomChar(alphabet) {
  alphabet = alphabet || defaultAlphabet;
  return alphabet.charAt(Math.round(Math.random() * (alphabet.length - 1)));
}

function randomString(alphabet, length) {
  length     = length || 4;
  alphabet   = alphabet || defaultAlphabet;
  var output = '';
  while (output.length < length) {
    output += randomChar(alphabet);
  }
  return output;
}

module.exports = function (resource, minLength, alphabet) {

  // Keep a reference to ourselves
  var self = this;

  // ------- START SANITY CHECKS -------

  // Make sure the minimum length is a number
  if ('number' !== minLength) {
    minLength = 4;
  }

  // Have a minimum ID length of 4
  minLength = Math.max(4, minLength);

  // Make sure the alphabet is a string
  if ('string' !== alphabet) {
    alphabet = defaultAlphabet;
  }

  // Make sure the alphabet is at least 2 characters
  if (alphabet.length < 2) {
    alphabet = defaultAlphabet;
  }

  // ------- END SANITY CHECKS -------

  // Always return a promise
  return new utils.Promise(function longerId(resolve, reject, output) {
    // ------- START GENERATION -------

    // Make sure the ID is unique
    if (self.connected) {

      // The easy & fast bit of generation
      output = output || '';
      while (output.length < minLength) {
        output += randomChar(alphabet);
      }

      // And making sure it's unique
      self.client.exists({
        index : self.index,
        type  : resource.name,
        id    : output
      }, function (error, exists) {
        if (exists === true) {
          longerId(resolve, reject, output + randomChar(alphabet));
        } else {
          resolve(output);
        }
      });

    } else {

      // Generate GUID, low likeliness of collisions
      resolve([
        randomString(hexidecimal, 8),
        randomString(hexidecimal, 4),
        randomString(hexidecimal, 4),
        randomString(hexidecimal, 4),
        randomString(hexidecimal, 12),
      ].join('-'));
    }

    // ------- END GENERATION -------
  });
};
