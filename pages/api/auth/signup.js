import { hashPassword } from "../../../lib/auth";
import { connectToDataBase } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }
  const data = req.body;
  const { name, email, password } = data;
  if (!email || !email.includes("@") || !password) {
    res.status(422).json({
      message:
        "Invalid input - password also should be at least 1 character long.",
    });
    return;
  }

  const client = await connectToDataBase();
  const db = client.db();
  const existingUser = await db.collection("users").findOne({ email: email });

  if (existingUser) {
    res.status(422).json({ message: "User exists already!" });
    client.close();
    return;
  }
  const hashedPassword = await hashPassword(password);

  let registerDate = new Date().toLocaleDateString();
  const result = await db.collection("users").insertOne({
    name: name,
    email: email,
    password: hashedPassword,
    registerDate: registerDate,
    lastVisit: "never",
    status: "unblocked",
  });

  res.status(201).json({ message: "Created user!" });
  client.close();
}
