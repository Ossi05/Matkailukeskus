import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        first: {
            type: String,
            required: true,
        },
        last: {
            type: String,
            required: true,
        }
    }
});

// userSchema.plugin(passportLocalMongoose); // Adds user and password to userSchema
userSchema.plugin(passportLocalMongoose, {
    usernameQueryFields: ['username', 'email'],
    errorMessages: {
        MissingPasswordError: 'Salasanaa ei annettu',
        AttemptTooSoonError: 'Tili on tällä hetkellä lukittu. Yritä uudelleen myöhemmin',
        TooManyAttemptsError: 'Tili lukittu liian monen epäonnistuneen kirjautumisyrityksen vuoksi. Yritä kohta uudelleen',
        NoSaltValueStoredError: 'Tunnistautuminen ei ole mahdollista. Suola-arvoa ei ole tallennettu',
        IncorrectPasswordError: 'Salasana tai käyttäjätunnus/sähköposti on virheellinen',
        IncorrectUsernameError: 'Salasana tai käyttäjätunnus/sähköposti on virheellinen',
        MissingUsernameError: 'Käyttäjätunnusta ei annettu',
        UserExistsError: 'Käyttäjätunnuksella oleva käyttäjä on jo rekisteröity'
    },
    limitAttempts: true,
    maxAttempts: 5,
    unlockInterval: 10000,

});
// Password validation https://www.npmjs.com/package/passport-local-mongoose

userSchema.virtual("fullName").get(function () {
    return `${this.name.first} ${this.name.last}`;
});
const User = mongoose.model("User", userSchema);
export default User;