import { MongoClient } from "mongodb";

export async function connectToDataBase() {
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASS}@cluster0.hwdm7.mongodb.net/Test4DB`, {useNewUrlParser: true, useUnifiedTopology: true}
  );

  return client;
}
