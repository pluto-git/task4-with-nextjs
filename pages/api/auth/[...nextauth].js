import NextAuth from "next-auth";
import Providers from "next-auth/providers";

import { verifyPassword } from "../../../lib/auth";
import { connectToDataBase } from "../../../lib/db";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "something@email.com" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const client = await connectToDataBase();

        const usersCollection = client.db().collection("users");

        const user = await usersCollection.findOne({
          email: credentials.email,
        });
        if (!user) {
          client.close();
          throw new Error("No user found!");
        } else {
          console.log("User found");
          console.log(user);
          if (user.status == "blocked") {
            client.close();
            throw new Error("Could not log in! As the user is blocked!");
          }
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error("Could not log in!");
        } else {
          console.log("You can log in");
          let lastVisitDate = new Date().toLocaleDateString();
          await usersCollection.updateOne(
            { email: user.email },
            { $set: { lastVisit: lastVisitDate } }
          );
        }

        client.close();
        return { email: user.email };
      },
    }),
  ],
});
