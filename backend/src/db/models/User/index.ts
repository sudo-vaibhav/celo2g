import { prop, getModelForClass } from "@typegoose/typegoose";
import { web3, kit } from "@/celo";

export class User {
  @prop({ required: true })
  name!: string;

  @prop({ required: true, unique: true, minlength: 64, maxlength: 64 })
  privateKey!: string;

  public get publicKey() {
    return web3.eth.accounts.privateKeyToAccount(this.privateKey).address;
  }

  public get cUSDBalance() {
    return (async () => {
      kit.addAccount(this.privateKey);
      const stabletoken = await kit.contracts.getStableToken();
      let balance = await stabletoken.balanceOf(this.publicKey);
      return balance.toString();
    })();
  }
}

const UserModel = getModelForClass(User, {
  schemaOptions: {
    toJSON: {
      virtuals: true,
    },
  },
});

export default UserModel;
