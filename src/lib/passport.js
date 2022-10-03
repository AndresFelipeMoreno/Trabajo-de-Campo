const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');



passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            done(null, user, req.flash('success', 'Welcome ' + user.email));
        } else {
            done(null, false, req.flash('message', 'Contraseña incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message', 'El usuario no existe'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'fullname',
    passwordField: 'password',
    passReqToCallback: true

}, async (req, fullname, password, done) => {
    const { email } = req.body;
    const { phone } = req.body;
    const { confirmation } = req.body;
    const { department } = req.body;
    const { town } = req.body;

    await pool.query("SELECT email FROM users", async function (err, mails, fields) {
        if (err) throw err;
        let error2 = { error: "mostrar" };
        if (validate(mails, email)) {
            done(null, false, req.flash('message', 'Ya existe una cuenta con ese correo'));
        } else {
            if (password != confirmation) {
                let error = { error: "mostrar" }
                done(null, false, req.flash('message', 'Las contraseñas no coinciden'));
            }
            else {
                const newUser = { fullname, email, password, phone, department, town };
                newUser.password = await helpers.encryptPassword(password);

                const result = await pool.query('INSERT INTO users SET ?', [newUser]);
                newUser.idUser = result.insertId;

                return done(null, newUser, req.flash('message', 'Registro exitoso'));
            }
        }
    })
}));

function validate(mails, newMail) {
    for (const mail of mails) {
      if (mail.email == newMail) {
        return true;
      }
    }
    return false;
  }


//guardamos la sesion del usuario
passport.serializeUser((user, done) => {
    done(null, user.idUser);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE idUser = ?', [id]);
    done(null, rows[0]);
});