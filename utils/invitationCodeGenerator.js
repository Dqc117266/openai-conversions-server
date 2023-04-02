const { v4: uuidv4 } = require('uuid');

class InvitationCodeGenerator {
  static generate() {
    return uuidv4().replace(/-/g, '').substr(0, 9);
  }
}

module.exports = InvitationCodeGenerator;
