import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { avatarMap, axiosForCelo } from "../../helpers";
import { Doughnut } from "react-chartjs-2";

const Member = () => {
  const { mobile } = useParams();
  const history = useHistory();
  const [state, setState] = useState({
    avatar: "2",
    maxAllowance: 10,
    mobile: "+919999406876",
    name: "Grandma",
    payer: "60cc8ef9dfd0c681989155c4",
    usedAllowance: 9.6001,
    // _id: "60cc9dac7f8e27854bb46104"
  });

  useEffect(() => {
    (async () => {
      const resp = await axiosForCelo.get(`/user/dependant/${mobile}`);
      console.log(resp);
      setState(resp);
    })();
  }, [mobile]);

  const plotData = {
    labels: ["used", "unused"],
    datasets: [
      {
        // label: "Expenditure Analysis",
        data: [state.usedAllowance, state.maxAllowance - state.usedAllowance],
        backgroundColor: ["#F29479", "#70E796"],
        borderColor: ["transparent", "transparent"],
        borderWidth: 1,
      },
    ],

    options: {
      plugins: {
        labels: {
          display: false,
        },
      },
    },
  };
  return (
    <div className="flex flex-col items-center text-center">
      <img
        src={avatarMap[state.avatar]}
        className="rounded-full"
        alt="profile"
      />
      <div className="mt-2 text-2xl">{state.name}</div>
      <div className="my-2 text-sm">{state.mobile}</div>
      <div className="text-xl ">
        {state.usedAllowance.toFixed(2)}/{state.maxAllowance} cUSD allowance
        spent
      </div>
      <Doughnut data={plotData} />
      <div className="grid grid-cols-2 w-full gap-4 px-4 my-8">
        <div>
          <button
            className="btn bg-secondary-900"
            onClick={async () => {
              try {
                const newLimit = parseFloat(
                  prompt("enter new limit (will reset allowance spent so far)")
                );
                await axiosForCelo.patch("/user/dependant", {
                  mobile: mobile,
                  maxAllowance: newLimit,
                  usedAllowance: 0,
                });
              } catch (err) {
                alert("error occured in changing limit");
                console.log(err);
              } finally {
                window.location.reload();
              }
            }}
          >
            Reset Limit
          </button>
        </div>
        <div>
          <button
            className="btn bg-primary-900"
            onClick={async () => {
              try {
                await axiosForCelo.delete("/user/dependant/" + mobile);
              } catch (err) {
                alert("error occured while deleting");
                console.log(err);
              } finally {
                history.push("/");
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Member;
