import { useState } from "react";

const EMPTY = { matricule: "", nomPrenom: "", telephone: "" };

// Formulaire réutilisable pour l'ajout (et plus tard la modification)
// onSubmit(values) doit renvoyer { ok, errors }
export default function StudentForm({ initialValues = EMPTY, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Efface l'erreur du champ dès que l'utilisateur corrige
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = onSubmit(values);
    if (!result.ok) setErrors(result.errors);
  };

  const field = (name, label, props = {}) => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={values[name]}
        onChange={handleChange}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        {...props}
      />
      {errors[name] && (
        <span className="field__error" id={`${name}-error`} role="alert">
          {errors[name]}
        </span>
      )}
    </div>
  );

  return (
    <form className="form" onSubmit={handleSubmit} noValidate style={{display: "none"}}>
      {field("matricule", "Matricule", { placeholder: "Ex. : E001", autoFocus: true, autoComplete: "off" })}
      {field("nomPrenom", "Nom et prénom", { placeholder: "Ex. : Rakoto Jean", autoComplete: "off" })}
      {field("telephone", "Téléphone", { placeholder: "Ex. : 034 12 345 67", type: "tel", inputMode: "tel" })}

      {errors.global && <p className="field__error" role="alert">{errors.global}</p>}

      <div className="form__actions">
        <button type="submit" className="btn btn--primary">{submitLabel}</button>
        {onCancel && (
          <button type="button" className="btn" onClick={onCancel}>Annuler</button>
        )}
      </div>
    </form>
  );
}