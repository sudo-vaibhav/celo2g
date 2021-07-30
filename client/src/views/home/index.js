import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import QRCode from "react-qr-code";
import cusd from "./cusd.svg";
import celo from "./celo.svg";
import FeatherIcon from "feather-icons-react";
import {
  avatarMap,
  axiosForCelo,
  CELO_PRIVATE_KEY,
  kit,
  web3,
} from "../../helpers";

const Home = () => {
  const [state, setState] = useState({
    _id: "",
    name: "",
    publicKey: null,
    cUSDBalance: null,
    dependants: [],
  });
  useEffect(() => {
    (async () => {
      const resp = await axiosForCelo.get("/user");
      kit.addAccount(CELO_PRIVATE_KEY);
      const stableToken = await kit.contracts.getStableToken();
      const goldToken = await kit.contracts.getGoldToken();
      const cUSDBalance = await stableToken.balanceOf(resp.publicKey);
      const celoBalance = await goldToken.balanceOf(resp.publicKey);

      setState({
        ...resp,
        cUSDBalance: web3.utils.fromWei(cUSDBalance.toString()),
        celoBalance: web3.utils.fromWei(celoBalance.toString()),
      });
    })();
  }, []);
  console.log("balance: ", state.cUSDBalance);
  return (
    <div>
      <div className="px-2">
        <h2 className="text-4xl font-bold ">Hi {state.name}!</h2>
        <div className="grid grid-cols-2 my-4">
          <div className="flex items-center">
            <QRCode
              value={`celo://wallet/pay?address=${state.publicKey}`}
              bgColor="rgba(0,0,0,0)"
              fgColor="black"
              size={window.innerWidth / 2.5}
            />
          </div>
          <div className="text-2xl flex flex-col justify-center">
            {[
              {
                img: cusd,
                key: "cUSDBalance",
              },
              {
                img: celo,
                key: "celoBalance",
              },
            ].map((e, idx) => {
              return (
                state[e.key] && (
                  <div
                    className="rounded-full flex my-2 bg-secondary-900"
                    key={idx}
                  >
                    <div
                      className="flex-1 flex items-center justify-center p-2 font-semibold text-3xl text-center"
                      // style={{
                      //   color: "white",
                      // }}
                      key={idx}
                    >
                      {state[e.key].slice(0, state[e.key].indexOf(".") + 3)}
                    </div>
                    <img
                      src={e.img}
                      style={{
                        height: 56,
                      }}
                      alt="currency"
                    />
                  </div>
                )
              );
            })}
          </div>
        </div>
      </div>
      <div
        className="rounded-t-xl px-2 py-4 bg-primary-900 " //fixed w-screen bottom-0
        style={{
          minHeight: "60vh",
        }}
      >
        <div className="text-center text-2xl font-bold mb-8">
          Your Family Members
        </div>
        <div className="grid grid-cols-2 gap-y-4 font-bold text-xl">
          {state.dependants.map((dependant, idx) => {
            return (
              <Link
                className="flex flex-col justify-center"
                key={idx}
                to={"/member/" + dependant.mobile}
              >
                <img
                  src={avatarMap[dependant.avatar]}
                  style={{
                    width: 96,
                  }}
                  className="rounded-full mx-auto"
                  alt="person"
                />
                <div className="text-center">{dependant.name}</div>
              </Link>
            );
          })}
          <div className="flex flex-col justify-center">
            <Link
              to="/add-member"
              className="grid place-items-center rounded-full mx-auto"
              style={{
                backgroundColor: "#F6DFCD",
                width: 96,
                height: 96,
              }}
            >
              <FeatherIcon icon="plus" size={60} />
            </Link>
            <div>&nbsp;</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
