import { connectToDataBase } from "../../lib/db";
import { getSession } from "next-auth/client";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return;
  }

  const session = await getSession({ req: req });
  if (!session) {
    res.status(400).json({ message: "Not authenticated!" });
  }

  const data = req.body;
  const { selectedUsers, status } = data;

  const client = await connectToDataBase();
  const usersCollection = client.db().collection("users");

  for (let i in selectedUsers) {
    const updateStatus = await usersCollection.updateOne(
      { email: selectedUsers[i] },
      { $set: { status: status } }
    );
    if (!updateStatus) {
      throw new Error(
        "Something went wrong on the patch request. Check users!"
      );
    }
  }
  res.status(201).json({ message: "Successfully patched statuses" });

  client.close();
}
