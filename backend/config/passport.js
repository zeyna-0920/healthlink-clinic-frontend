import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import Patient from '../models/Patient.js';
import dotenv from 'dotenv';

dotenv.config();

const configurePassport = () => {
  // Stratégie Google
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || 'dummy',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy',
        callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/patients/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let patient = await Patient.findOne({ 
            $or: [{ googleId: profile.id }, { email: profile.emails[0].value }] 
          });

          if (patient) {
            if (!patient.googleId) {
              patient.googleId = profile.id;
              await patient.save();
            }
            return done(null, patient);
          }

          patient = new Patient({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            googleId: profile.id,
            isRegistered: true,
            registrationDate: new Date(),
          });

          await patient.save();
          done(null, patient);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

  // Stratégie GitHub
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID || 'dummy',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy',
        callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/patients/auth/github/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.com`;
          let patient = await Patient.findOne({ 
            $or: [{ githubId: profile.id }, { email }] 
          });

          if (patient) {
            if (!patient.githubId) {
              patient.githubId = profile.id;
              await patient.save();
            }
            return done(null, patient);
          }

          const names = profile.displayName ? profile.displayName.split(' ') : [profile.username, ''];
          patient = new Patient({
            firstName: names[0],
            lastName: names.slice(1).join(' '),
            email: email,
            githubId: profile.id,
            isRegistered: true,
            registrationDate: new Date(),
          });

          await patient.save();
          done(null, patient);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
};

export default configurePassport;
