const bcrypt = require('bcryptjs')

// Made class for User
class User {

    constructor(firstname, lastname, email, password) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
    }

    // Hash the upcoming passwords
    async hashPassword(password) {
        this.password = await bcrypt.hash(password, 12);
    }
    // Unhash the upcoming passwords
    async unHashPassword(password) {
        return await bcrypt.compareSync(password, this.password);
    }
}

module.exports = User;