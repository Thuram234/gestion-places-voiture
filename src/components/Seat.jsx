// Carte d'un siège : numéro + nom de l'étudiant si occupé
export default function Seat({ seat, selected, onSelect }) {
  const occupied = Boolean(seat.student);
  const label = occupied
    ? `Place ${seat.id}, occupée par ${seat.student.nomPrenom}`
    : `Place ${seat.id}, libre`;

  return (
    <button
      type="button"
      className={`seat ${occupied ? "seat--occupied" : "seat--free"} ${selected ? "seat--selected" : ""}`}
      onClick={() => onSelect(seat.id)}
      aria-label={label}
      aria-pressed={selected}
    >
      <span className="seat__number">{seat.id}</span>
      <span className="seat__name">{occupied ? seat.student.nomPrenom : "Libre"}</span>
    </button>
  );
}