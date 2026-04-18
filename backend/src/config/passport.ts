import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  Strategy as GithubStrategy,
  Profile as GithubProfile,
} from "passport-github2";
import { executeQuery } from "../utils/dbQuery";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) return done(null, false);

        let user = (
          await executeQuery("SELECT * FROM users WHERE email = $1", [email])
        )[0];

        if (!user) {
          user = (
            await executeQuery(
              `INSERT INTO users (name, email, auth_provider, provider_id, avatar)
               VALUES ($1,$2,$3,$4,$5) RETURNING *`,
              [
                profile.displayName,
                email,
                "google",
                profile.id,
                profile.photos?.[0]?.value,
              ],
            )
          )[0];
        }

        done(null, user);
      } catch (err) {
        done(err);
      }
    },
  ),
);

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    async (
      _accessToken: any,
      _refreshToken: any,
      profile: GithubProfile,
      done: (arg0: unknown, arg1: boolean | undefined) => void,
    ) => {
      try {
        let email = null;

        if (profile.emails && profile.emails.length > 0) {
          email = profile.emails[0].value;
        }

        // 2️⃣ If not available, fetch manually
        if (!email) {
          const response = await fetch("https://api.github.com/user/emails", {
            headers: {
              Authorization: `Bearer ${_accessToken}`,
              Accept: "application/vnd.github+json",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch GitHub emails");
          }

          const emails = await response.json();

          // Find primary email
          const primaryEmail = emails.find(
            (emailObj: any) => emailObj.primary === true,
          );

          if (primaryEmail) {
            email = primaryEmail.email;
          }
        }

        if (!email) {
          return done(null, false);
        }

        let user = (
          await executeQuery("SELECT * FROM users WHERE email = $1", [email])
        )[0];
        if (!user) {
          user = (
            await executeQuery(
              `INSERT INTO users (name, email, auth_provider, provider_id, avatar)
              VALUES ($1,$2,$3,$4,$5) RETURNING *`,
              [
                profile.displayName || profile.username,
                email,
                "github",
                profile.id,
                profile.photos?.[0]?.value,
              ],
            )
          )[0];
          console.log(" inside github user  ", user);
        }

        done(null, user);
      } catch (err) {
        done(err, false);
      }
    },
  ),
);

export default passport;
