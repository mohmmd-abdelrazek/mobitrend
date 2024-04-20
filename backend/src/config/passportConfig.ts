import passport from "passport";
import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import UserModel from "../models/UserModel"; // Assuming your user model file is named User.ts and located in the models directory

passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Use 'email' instead of 'username'
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email: email });
        if (user) {
          if (bcrypt.compareSync(password, user.password)) {
            done(null, user);
          } else {
            done(null, false, { message: "Invalid password." });
          }
        } else {
          done(null, false, { message: "Invalid email" });
        }
      } catch (err) {
        done(err);
      }
    }
  )
);

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//       callbackURL: "/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         if (!profile.emails || profile.emails.length === 0) {
//           return done(null, undefined, {
//             message: "No email found from Google account.",
//           });
//         }

//         const email = profile.emails[0].value;
//         let user = await User.findOne({ google_id: profile.id });

//         if (!user) {
//           // If the user doesn't exist, create a new user record
//           user = await User.create({
//             google_id: profile.id,
//             email: email,
//             name: profile.displayName
//           });
//         }

//         done(null, user);
//       } catch (err) {
//         done(err, undefined);
//       }
//     }
//   )
// );

passport.serializeUser((user: Express.User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findById(id);
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err);
  }
});

export default passport;
