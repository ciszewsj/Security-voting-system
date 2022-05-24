const bcrypt = require('bcrypt');
const config = require('config');

class PasswordSecurity {

    async hashPassword(password) {
        let salt = await bcrypt.genSalt(config.get("saltRounds"));
        return bcrypt.hash(password, salt);
    };

    async comparePassword(password, hashPassword) {
        return  bcrypt.compare(password.toString(), hashPassword.toString());
    }
}

module.exports.PasswordSecurity = PasswordSecurity;