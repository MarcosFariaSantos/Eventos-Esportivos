import { Account, Client, Databases, ID } from "appwrite";

const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject("69c703e10013b638f713");

export const account = new Account(client);
export const databases = new Databases(client);
export { ID };

