import Dependant from "@/db/models/Dependant";
import User from "@/db/models/User";
import { NextFunction, Router, Request, Response } from "express";
const userRouter = Router();

userRouter.post("/", async (req, res) => {
  const { name, privateKey } = req.body;

  const user = await User.create([
    {
      name,
      privateKey,
    },
  ]);

  return res.send(user);
});

// this middleware will ensure that requests have the celo header present in them

const celoMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { celo } = req.headers as {
    celo: string;
  };
  console.log("celo private key: ", celo);
  if (celo) {
    next();
  } else {
    throw new Error("Celo header is not present, can't verify request");
  }
};

userRouter.get("/", celoMiddleware, async (req, res) => {
  const { celo } = req.headers as { celo: string };
  const user = await User.findOne({
    privateKey: celo,
  });

  return res.send({
    ...user?.toJSON(),
    dependants: await Dependant.find({ payer: user?._id }),
  });
});

userRouter.patch("/dependant", celoMiddleware, async (req, res) => {
  const { celo } = req.headers as { celo: string };
  const { mobile } = req.body;
  const dependant =
    (await Dependant.findOne({
      mobile: mobile,
    })) || new Dependant();

  Object.keys(req.body).forEach((key: string) => {
    //@ts-ignore
    dependant[key] = req.body[key];
  });

  dependant.payer = (await User.findOne({
    privateKey: celo,
  }))!._id;
  await dependant.save();
  return res.send(dependant);
});

userRouter.delete("/dependant/:mobile", celoMiddleware, async (req, res) => {
  const { celo } = req.headers as {
    celo: string;
  };

  return res.send(
    await Dependant.deleteOne({
      mobile: req.params.mobile,
      payer: (await User.findOne({ privateKey: celo }))!._id,
    })
  );
});

userRouter.get("/dependant/:mobile", celoMiddleware, async (req, res) => {
  const { celo } = req.headers as { celo: string };
  const { mobile } = req.params;
  return res.send(
    await Dependant.findOne({
      mobile,
      payer: (await User.findOne({ privateKey: celo }))!._id,
    })
  );
});
export default userRouter;
