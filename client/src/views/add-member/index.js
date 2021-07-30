import { Formik, Form } from "formik";
import FormField from "../../components/FormField";
import FeatherIcon from "feather-icons-react";
import { avatarMap, axiosForCelo } from "../../helpers";
import { useHistory } from "react-router-dom";
const AddMember = () => {
  // name
  // mobile
  // avatar
  // maxAllowance
  const history = useHistory();
  return (
    <div className="px-2 py-2">
      <Formik
        initialValues={{
          name: "Grandpa",
          mobile: "+918459162440",
          avatar: "1",
          maxAllowance: 10,
        }}
        onSubmit={async ({ name, mobile, avatar, maxAllowance }) => {
          const values = {
            name,
            mobile,
            avatar,
            maxAllowance: parseFloat(maxAllowance),
          };
          console.log("values: ", values);
          try {
            await axiosForCelo.patch("/user/dependant", values);
          } catch (err) {
            alert("some error occured");
          } finally {
            history.push("/");
          }
        }}
      >
        {({ values, setFieldValue }) => {
          return (
            <Form>
              <h1 className="text-2xl py-8 font-bold text-center">
                Add a Family Member
              </h1>
              <FormField fieldName="name" />
              <FormField fieldName="mobile" />
              <FormField fieldName="maxAllowance" extraData="(in cUSD)" />
              <div>
                <label>Pick an Avatar</label>
                <div className="grid grid-cols-3 mt-4 gap-4">
                  {Object.keys(avatarMap).map((key) => {
                    return (
                      <div
                        key={key}
                        className="relative"
                        onClick={() => {
                          setFieldValue("avatar", key);
                        }}
                      >
                        <img
                          src={avatarMap[key]}
                          className="rounded-full mx-auto"
                          alt={key}
                        />
                        {values.avatar === key && (
                          <div className="absolute bottom-0 right-0 text-secondary-900">
                            <FeatherIcon icon="check-circle" size={30} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <button type="submit" className="btn bg-secondary-900">
                ADD
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AddMember;
