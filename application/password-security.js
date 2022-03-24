const bcrypt = require('bcrypt');
const config = require('config');

class PasswordSecurity {

    async hashPassword(password) {
        let salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    };
}

module.exports.PasswordSecurity = PasswordSecurity;