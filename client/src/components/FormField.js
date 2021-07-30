import { Field } from "formik";
const useLabelText = (str) => {
  // adding space between strings
  const result = str.replace(/([A-Z])/g, " $1");

  // converting first character to uppercase and join it to the final string
  const final = result.charAt(0).toUpperCase() + result.slice(1);

  return final; // "My Name"
};

const FormField = ({
  fieldName,
  extraData = "",
  inputClassName = "",
  as,
  children,
}) => {
  const type =
    ["password", "email"].find((e) => e === fieldName.toLowerCase()) || "text";
  const labelText = useLabelText(fieldName);
  const className = `w-full p-3 rounded-lg border border-black my-3 ${inputClassName}`;
  return (
    <div>
      <label>
        {labelText} {extraData}
      </label>
      <Field
        name={fieldName}
        style={{
          background: "transparent",
        }}
        placeHolder={fieldName}
        type={type}
        required
        className={className}
      />
    </div>
  );
};

export default FormField;
