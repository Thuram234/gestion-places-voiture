// Compteur de places occupées / disponibles
export default function SeatCounter({ occupied, free, total }) {
  const percent = Math.round((occupied / total) * 100);
  return (
    <div className="counter" aria-live="polite">
      <div className="counter__numbers">
        <strong>{occupied}/{total}</strong>
        <span>places occupées</span>
        <span className="counter__free">{free} disponible{free > 1 ? "s" : ""}</span>
      </div>
      <div className="counter__bar" role="progressbar" aria-valuenow={occupied} aria-valuemin={0} aria-valuemax={total}>
        <div className="counter__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}