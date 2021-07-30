export { OdisUtils } from "@celo/identity";
import Web3 from "web3";
import * as ContractKit from "@celo/contractkit";

//https://alfajores-forno.celo-testnet.org
export const web3 = new Web3("https://alfajores-forno.celo-testnet.org");
export const kit = ContractKit.newKitFromWeb3(web3);
export { AddressUtils } from "@celo/utils";
