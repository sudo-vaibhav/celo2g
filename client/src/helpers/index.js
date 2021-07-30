import img1 from "./family/1.jpeg";
import img2 from "./family/2.jpeg";
import img3 from "./family/3.jpeg";
import img4 from "./family/4.jpeg";
import axios from "axios";

import Web3 from "web3";
import * as ContractKit from "@celo/contractkit";

import { CELO_PRIVATE_KEY } from "./secret";
//https://alfajores-forno.celo-testnet.org
export const web3 = new Web3("https://alfajores-forno.celo-testnet.org");
export const kit = ContractKit.newKitFromWeb3(web3);

export const avatarMap = {
  1: img1,
  2: img2,
  3: img3,
  4: img4,
};

export const axiosForCelo = axios.create({
  baseURL:
    // process.env.ENVIRONMENT === "dev"
    // ?
    "https://celo2g.azurewebsites.net",
  // : "https://celo2g.azurewebsites.net",
});

axiosForCelo.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosForCelo.defaults.headers.common["celo"] = CELO_PRIVATE_KEY;

// export const CELO_PRIVATE_KEY = CELO_PRIVATE_KEY;

export { CELO_PRIVATE_KEY };
