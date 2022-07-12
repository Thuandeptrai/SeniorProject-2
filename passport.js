const GoogleStrategy = require("passport-google-oauth2").Strategy;
const passport = require("passport");
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "382631347234-7vmpnpev45bjbsj30pipjo7re3gsmre9.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "https://playful-sunshine-3b1379.netlify.app/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
