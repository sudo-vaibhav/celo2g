import { Router } from "express";
import { isDocument } from "@typegoose/typegoose";
import Dependant from "@/db/models/Dependant";
import mongoose from "mongoose";
import { OdisUtils, AddressUtils, kit } from "@/celo";
const messageRequestRouter = Router();

messageRequestRouter.post("/", async (req, res) => {
  const { message, sender } = req.body as {
    message: string;
    sender: string;
  };

  console.log("got this from integromat:", message, sender);
  let response: any;
  const session = await mongoose.startSession();
  await session.withTransaction(() => {
    return new Promise(async (resolve, reject) => {
      try {
        let [intent, receipientPhone, amountInCUSD] = message.split(" "); // format should be "celo <phone_number> <amount_in_cUSD>"
        const amountAsNum = parseFloat(amountInCUSD);
        receipientPhone =
          receipientPhone[0] === "+"
            ? receipientPhone
            : "+91" + receipientPhone;
        if (intent.toLowerCase() === "celo") {
          const dependant = await Dependant.findOne({
            mobile: sender,
          }).populate("payer");

          if (
            dependant!.maxAllowance <
            dependant!.usedAllowance + amountAsNum
          ) {
            //   await session.abortTransaction();
            return reject("Amount exceeds the max threshold allowed to you");
          }
          if (isDocument(dependant!.payer)) {
            const privateKey = dependant!.payer.privateKey;

            console.log("private key: ", privateKey);
            console.log("receipient phone: ", receipientPhone);

            const from = AddressUtils.normalizeAddressWith0x(
              AddressUtils.privateKeyToAddress(privateKey)
            );

            kit.addAccount(privateKey);

            console.log("from: ", from);
            const result =
              await OdisUtils.PhoneNumberIdentifier.getPhoneNumberIdentifier(
                receipientPhone,
                from,
                {
                  authenticationMethod:
                    OdisUtils.Query.AuthenticationMethod.WALLET_KEY,
                  contractKit: kit,
                },
                OdisUtils.Query.getServiceContext("alfajores")
              );

            console.log("res: ", result);
            const attesationsContract = await kit.contracts.getAttestations();
            let mapping = await attesationsContract.lookupIdentifiers([
              result.phoneHash,
            ]);

            const targetAddress = Object.keys(
              //@ts-ignore
              mapping[Object.keys(mapping)[0]]
            )[0];

            // Specify an amount to send
            let amount = kit.web3.utils.toWei(amountInCUSD, "ether");

            // Get the token contract wrappers
            let stabletoken = await kit.contracts.getStableToken();

            // Transfer CELO and cUSD from your account to anAddress
            // Specify cUSD as the feeCurrency when sending cUSD
            let cUSDtx = await stabletoken
              .transfer(targetAddress, amount)
              .send({ from, feeCurrency: stabletoken.address });

            // Wait for the transactions to be processed
            let cUSDReceipt = await cUSDtx.waitReceipt();

            // 17. Print receipts
            console.log(
              `cUSD Transaction: https://alfajores-blockscout.celo-testnet.org/tx/${cUSDReceipt.transactionHash}/`
            );

            // 18. Get your new balances
            let cUSDBalance = await stabletoken.balanceOf(from);

            console.log(
              `Your new account cUSD balance: ${kit.web3.utils.fromWei(
                cUSDBalance.toString(),
                "ether"
              )}`
            );

            dependant!.usedAllowance = dependant!.usedAllowance + amountAsNum;
            await dependant!.save();
            response = {
              ...dependant?.toJSON(),
              updatedBalanceOfSource: cUSDBalance.toString(),
            };
            return resolve(response);
          } else {
            return reject("Payer doesn't exist");
          }
        } else {
          return reject("message was unrelated to celo");
        }
      } catch (err) {
        return reject(err.toString());
      }
    });
  });
  session.endSession(() => {
    return res.send(response);
  });
});

export default messageRequestRouter;
