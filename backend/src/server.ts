import "module-alias/register";
import app from "./app";
// import { connectDB } from "./db"
import Dependant from "./db/models/Dependant";
import User from "./db/models/User";
import mongoose from "mongoose";
const PORT = process.env.PORT || 8000;
mongoose.set("runValidators", true);
mongoose
  .connect(process.env.MONGODB_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(async () => {
    console.log("connected to DB");
    await Promise.all([Dependant.init(), User.init()]);
    app.listen(PORT, () => {
      console.log("app is listening on port " + PORT);
    });
  });
