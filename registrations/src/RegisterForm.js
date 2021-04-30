import { useState, useRef } from "react";
import db from './firebase/db'

const RegisterForm = function (){

  const [isChecked, setIsChecked] = useState(null);
  const [formWasValidated, setFormWasValidated] = useState(false);

  const [formAlertText, setFormAlertText] = useState("");
  const [formAlertType, setFormAlertType] = useState("");

  const [inputFields, setInputFields] = useState({
    fullName: "",
    email: "",
    role: "",
    isActive: false
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    role: "",
    isActive: false
  });

  const references = {
    fullName: useRef(),
    email: useRef(),
    role: useRef(),
    isActive: useRef()
  };


  const errorTypes = {
    required: "Kitöltése kötelező",
    validEmail: "Nem megfelelő email cím formátum",
    select: "Választani kötelező"
  };

  const validators = {
    fullName: {
      required: isNotEmpty,
    },
    email: {
      required: isNotEmpty,
      validEmail: isValidEmail
    },
    role: {
      select: addSelect,
    }
  };

  function addSelect(value){
    return value !== "";
  }

  function isNotEmpty(value) {
    return value !== "";
  }

  function isValidEmail(value) {

    if (value !== "undefined") {

        let pattern = new RegExp(
            /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
        );

        return pattern.test(value)
    }
}



  function validateField(fieldName) {
    
    const value = inputFields[fieldName];
   
    let isValid = true;
    setErrors((previousErrors) => ({
      ...previousErrors,
      [fieldName]: "",
    }));

    references[fieldName].current.setCustomValidity("");

    if (validators[fieldName] !== undefined) {
      for (const [validationType, validatorFn] of Object.entries(
        validators[fieldName]
      )) {
        if (isValid !== false) {
          isValid = validatorFn(value);
          if (!isValid) {
            const errorText = errorTypes[validationType];

            setErrors((previousErrors) => {
              return {
                ...previousErrors,
                [fieldName]: errorText,
              };
            });
            references[fieldName].current.setCustomValidity(errorText);
          }
        }
      } 
    }
    return isValid;
  }

  function isFormValid() {
    let isFormValid = true;
    for (const fieldName of Object.keys(inputFields)) {
      const isFieldValid = validateField(fieldName);
      if (!isFieldValid) {
        isFormValid = false;
      }
    }
    return isFormValid;
  }

  const handleFormCheck = (e) => {
    setInputFields({
      ...inputFields,
      isNew: e.target.checked,
    });
  
  };

  async function handleSubmit(e) {
    e.preventDefault();

    setFormAlertText("");
    setFormAlertType("");
    setFormWasValidated(false);

    const isValid = isFormValid();

    if (isValid) {
      db.collection("products")
        .add({
          ...inputFields,
        })
        .then((docRef) => {
          setFormAlertText(`Sikeres mentés`);
          setFormAlertType("success");
          setInputFields({
            fullName: "",
            email: "",
            role: "",
            isActive: false
          });
        });
    } else {
      setFormWasValidated(true);
    }
  }

  function handleOnChangeInputs(event) {
    setInputFields({
      ...inputFields,
      [event.target.name]: event.target.value,
    });
    
  }

  function handleInputBlur(e) {
    const name = e.target.name;

    validateField(name);
  }

  const handleCheck = (e) => {
    setIsChecked(e.target.checked);
  }

  return (
    <div>

   
    <h1>Regisztráció</h1>
<form action="">


    <PersonInput
    reference={references["firstName"]}
    name="firstName"
    labelText="Név"
    type="text"
    errors={errors}
    inputFields={inputFields}
    handleInputBlur={handleInputBlur}
    handleInputChange={handleOnChangeInputs}
    required={true}
  />
  <PersonInput
    reference={references["email"]}
    name="email"
    labelText="Email cím"
    type="email"
    errors={errors}
    inputFields={inputFields}
    handleInputBlur={handleInputBlur}
    handleInputChange={handleOnChangeInputs}
    required={true}
  />
    <div className="form-group">
          <label htmlFor="form-choice">Jogkör</label>
          <select
            ref={references["category"]}
            name="category"
            id="form-choice"
            value={inputFields.category}
            onChange={handleOnChangeInputs}
            onBlur={handleInputBlur}
          >
            <option value="">vendég</option>
            <option value="házas">admin</option>
            <option value="egyedülálló">regisztrált felhasználó</option>
          
          </select>
        </div>
        <div className="form-check">
          <input onChange={handleCheck} className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
          <label className="form-check-label" htmlFor="flexCheckDefault">
          Aktív
          </label>

        </div>

        <button
        onClick={handleSubmit}
        type="submit" className="btn btn-primary mt-3 mb-3">
          Regisztráció
        </button>
        </form>
        {formAlertText && (
        <div className={`alert mt-3 mb-3 alert-${formAlertType}`} role="alert">
          {formAlertText}
        </div>
      )}

</div>
  );
};



function PersonInput({
  errors,
  inputFields,
  handleInputChange,
  handleInputBlur,
  type,
  name,
  labelText,
  required,
  reference,
}) {
  return (
    <div className={`mb-3 ${errors[name] !== "" ? "was-validated" : ""}`}>
      <label className="form-label">{labelText}</label>
      <input
        type={type}
        className="form-control"
        id={name}
        name={name}
        value={inputFields[name]}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        required={required}
        ref={reference}
      />
      <div className="invalid-feedback">{errors[name]}</div>
    </div>
  );
}

export default RegisterForm
