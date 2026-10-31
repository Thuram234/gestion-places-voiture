import { useCallback, useState } from "react";
import useSeats from "./hooks/useSeats";
import CarLayout from "./components/CarLayout";
import SeatCounter from "./components/SeatCounter";
import StudentPanel from "./components/StudentPanel";
import Toast from "./components/Toast";
import "./styles/form.css";
import "./styles/responsive.css";


export default function App() {
  const { seats, occupied, free, total, addStudent, updateStudent, removeStudent } = useSeats();
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState(null);
  const selectedSeat = seats.find((s) => s.id === selectedId);

  const showToast = (type, message) => setToast({ type, message, id: Date.now() });
  const closeToast = useCallback(() => setToast(null), []);

  // Affiche le toast adapté au résultat d'une opération
  const notify = (result, successMessage) => {
    if (result.ok) showToast("success", successMessage);
    else if (result.errors.global) showToast("error", result.errors.global);
    else showToast("error", "Veuillez corriger les champs signalés.");
    return result;
  };

  const handleAdd = (data) =>
    notify(addStudent(selectedId, data), `Étudiant ajouté à la place ${selectedId}.`);

  const handleUpdate = (data) =>
    notify(updateStudent(selectedId, data), "Informations mises à jour.");

  const handleRemove = () => {
    const name = selectedSeat.student.nomPrenom;
    notify(removeStudent(selectedId), `${name} a été retiré(e) de la place ${selectedId}.`);
  };

  return (
    <main className="app">
      <header className="app__header">
        <h1>Gestion des places (V4)</h1>
        <p>Mercedes-Benz Sprinter · voyage d'étude</p>
      </header>

      <SeatCounter occupied={occupied} free={free} total={total} />

      <div className="app__content">
        <CarLayout
          seats={seats}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId((prev) => (prev === id ? null : id))}
        />
        
        {/* key : remet à zéro le mode édition quand on change de place */}
        <StudentPanel
          key={selectedId}
          seat={selectedSeat}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onRemove={handleRemove}
          onClose={() => setSelectedId(null)}
        />
      </div>

      <Toast toast={toast} onClose={closeToast} />
    </main>
  );
}