// this file doesn't work yet : (
import mongoose from "mongoose";
import Dependant from "./models/Dependant";
import User from "./models/User";
const connectDB = async () => {
  console.log("mongodb uri: ", process.env.MONGODB_URI);
  mongoose
    .connect(
      process.env.MONGODB_URI!,
      // "mongodb+srv://vaibhav:aMNyS19NkrBHlqtw@cluster0.jzmkj.mongodb.net/celo?retryWrites=true&w=majority"
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    )
    .then(async () => {
      await Promise.all([Dependant.init(), User.init()]);
    });
};

export { connectDB };
