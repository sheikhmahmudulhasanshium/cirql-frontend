import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import passport from 'passport';

// Load environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL as string;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email'],
},
async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
    try {
        // Here you would typically find or create a user in your database
        // based on the Google profile information (e.g., profile.id, profile.emails[0].value)

        // For demonstration purposes, we'll just return the profile
        const user = {
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : undefined,
            // You can add more fields from the profile as needed
        };

        // If user found/created successfully
        return done(null, user);

    } catch (error) {
        // Make sure to pass the error correctly. If error is not Error instance, wrap it.
        if (error instanceof Error) {
            return done(error);
        }
        return done(new Error(String(error)));
    }
}));

export default passport;