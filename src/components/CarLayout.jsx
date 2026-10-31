import Seat from "./Seat";
import { FRONT_SEATS, SEATS_PER_ROW } from "../utils/constants";

// Icône volant (conducteur)
function SteeringWheel() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M3.5 10.5 9.8 11.3M20.5 10.5l-6.3.8M12 14.2V21" />
    </svg>
  );
}

// Plan du véhicule : avant en haut, banquette du fond en bas
export default function CarLayout({ seats, selectedId, onSelect }) {
  const frontSeats = seats.slice(0, FRONT_SEATS);
  const rest = seats.slice(FRONT_SEATS);

  // Découpe les sièges restants en rangées de 4
  const rows = [];
  for (let i = 0; i < rest.length; i += SEATS_PER_ROW) {
    rows.push(rest.slice(i, i + SEATS_PER_ROW));
  }

  const renderSeat = (seat) => (
    <Seat key={seat.id} seat={seat} selected={seat.id === selectedId} onSelect={onSelect} />
  );

  return (
    <div className="car" role="group" aria-label="Plan du véhicule">
      <div className="car__front-label">Avant</div>

      {/* Rangée avant : conducteur à gauche, 2 sièges à droite */}
      <div className="car__row">
        <div className="driver" title="Conducteur">
          <SteeringWheel />
          <span>Conducteur</span>
        </div>
        <div className="car__spacer" />
        <div className="car__aisle" />
        {frontSeats.map(renderSeat)}
      </div>

      {/* 6 rangées de 4 : 2 sièges | couloir | 2 sièges */}
      {rows.map((row, index) => (
        <div className="car__row" key={index}>
          {row.slice(0, 2).map(renderSeat)}
          <div className="car__aisle" />
          {row.slice(2).map(renderSeat)}
          {index === rows.length - 1 && <span className="car__back-tag">Banquette du fond</span>}
        </div>
      ))}
    </div>
  );
}