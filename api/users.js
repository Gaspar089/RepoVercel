import clientPromise from "../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("mydatabase");
  const users = db.collection("users");

  switch (req.method) {
    case "GET":
      const data = await users.find().toArray();
      return res.status(200).json(data);
    case "POST":
      const user = req.body;
      await users.insertOne(user);
      return res.status(200).json({ message: "User added", user });
    default:
      return res.status(405).json({ error: "Method Not Allowed" });
  }
}
