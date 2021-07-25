import { connectToDataBase } from "../../lib/db";
import { getSession } from "next-auth/client";

export default async function handler(req, res) {
  if (req.method == "GET") {
    const session = await getSession({ req: req });
    if (!session) {
      res.status(401).json({ message: "Not authenticated!" });
    }

    const client = await connectToDataBase();
    const usersCollection = client.db().collection("users");
    const user = await usersCollection.find().toArray();
    res.json(user);
    client.close();
  } else if (req.method == "DELETE") {
    const session = await getSession({ req: req });
    if (!session) {
      res.status(401).json({ message: "Not authenticated!" });
    }

    const client = await connectToDataBase();
    const usersCollection = client.db().collection("users");
    const data = req.body;
    const { selectedUsers } = data;

    console.log(selectedUsers);
    for (let i in selectedUsers) {
      const deleteStatus = await usersCollection.deleteOne({
        email: selectedUsers[i],
      });
      if (!deleteStatus) {
        throw new Error(
          "Something went wrong on the DELETE request. Check users!"
        );
      } else {
        console.log(deleteStatus);
      }
    }

    res.status(201).json({ message: "Successfully deleted!" });
    client.close();
  } else {
    return;
  }
}
