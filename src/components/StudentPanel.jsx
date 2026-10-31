import { useState } from "react";
import StudentForm from "./StudentForm";
import ConfirmDialog from "./ConfirmDialog";

// Panneau de détail d'une place
// - place libre   : formulaire d'ajout
// - place occupée : fiche + Modifier / Supprimer (avec confirmation)
export default function StudentPanel({ seat, onAdd, onUpdate, onRemove, onClose }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (!seat) {
    return (
      <aside className="panel panel--empty">
        <p className="panel__hint">Sélectionnez une place pour consulter ou gérer son occupant.</p>
      </aside>
    );
  }

  const { student } = seat;

  const handleUpdate = (data) => {
    const result = onUpdate(data);
    if (result.ok) setEditing(false);
    return result;
  };

  const handleConfirmRemove = () => {
    setConfirming(false);
    onRemove();
  };

  return (
    <aside className="panel panel--active">
      <div className="panel__head">
        <h2>Place {seat.id}</h2>
        <span className={`badge ${student ? "badge--occupied" : "badge--free"}`}>
          {student ? "Occupée" : "Libre"}
        </span>
        <button type="button" className="panel__close" onClick={onClose} aria-label="Fermer le panneau">×</button>
      </div>

      {!student && (
        // key : réinitialise le formulaire quand on change de place
        <StudentForm key={seat.id} submitLabel="Ajouter l'étudiant" onSubmit={onAdd} onCancel={onClose} />
      )}

      {student && editing && (
        <StudentForm
          initialValues={student}
          submitLabel="Enregistrer"
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
        />
      )}

      {student && !editing && (
        <>
          <dl className="details">
            <dt>Matricule</dt>
            <dd>{student.matricule}</dd>
            <dt>Nom et prénom</dt>
            <dd>{student.nomPrenom}</dd>
            <dt>Téléphone</dt>
            <dd>{student.telephone}</dd>
          </dl>
          <div className="panel__actions">
            <button type="button" className="btn" onClick={() => setEditing(true)}>Modifier</button>
            <button type="button" className="btn btn--danger" onClick={() => setConfirming(true)}>Supprimer</button>
          </div>
        </>
      )}

      {confirming && (
        <ConfirmDialog
          title="Supprimer cet étudiant ?"
          message={`${student.nomPrenom} sera retiré(e) de la place ${seat.id}. Cette action est définitive.`}
          confirmLabel="Supprimer"
          onConfirm={handleConfirmRemove}
          onCancel={() => setConfirming(false)}
        />
      )}
    </aside>
  );
}