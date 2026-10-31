import { useCallback, useEffect, useMemo, useState } from "react";
import { STORAGE_KEY, TOTAL_SEATS, createEmptySeats } from "../utils/constants";
import { validateStudent } from "../utils/validation";

// Vérifie qu'une donnée stockée a bien la forme attendue
const isValidSeats = (data) =>
  Array.isArray(data) &&
  data.length === TOTAL_SEATS &&
  data.every(
    (s, i) =>
      s &&
      s.id === i + 1 &&
      (s.student === null ||
        (typeof s.student?.matricule === "string" &&
          typeof s.student?.nomPrenom === "string" &&
          typeof s.student?.telephone === "string"))
  );

// Lecture sécurisée du localStorage (données absentes, corrompues ou modifiées à la main -> plan vide)
function loadSeats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptySeats();
    const parsed = JSON.parse(raw);
    return isValidSeats(parsed) ? parsed : createEmptySeats();
  } catch {
    return createEmptySeats();
  }
}

export default function useSeats() {
  const [seats, setSeats] = useState(loadSeats);

  // Persistance après chaque modification
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seats));
    } catch {
      /* stockage plein ou indisponible : l'app reste utilisable */
    }
  }, [seats]);

  const occupied = useMemo(() => seats.filter((s) => s.student).length, [seats]);
  const free = TOTAL_SEATS - occupied;

  // Ajoute un étudiant sur une place libre
  const addStudent = useCallback(
    (seatId, data) => {
      const seat = seats.find((s) => s.id === seatId);
      if (!seat) return { ok: false, errors: { global: "Place introuvable." } };
      if (seat.student) return { ok: false, errors: { global: "Cette place est déjà occupée." } };

      const { errors, values } = validateStudent(data, seats);
      if (Object.keys(errors).length) return { ok: false, errors };

      setSeats((prev) => prev.map((s) => (s.id === seatId ? { ...s, student: values } : s)));
      return { ok: true };
    },
    [seats]
  );

  // Modifie l'étudiant d'une place occupée
  const updateStudent = useCallback(
    (seatId, data) => {
      const seat = seats.find((s) => s.id === seatId);
      if (!seat?.student) return { ok: false, errors: { global: "Aucun étudiant sur cette place." } };

      const { errors, values } = validateStudent(data, seats, seatId);
      if (Object.keys(errors).length) return { ok: false, errors };

      setSeats((prev) => prev.map((s) => (s.id === seatId ? { ...s, student: values } : s)));
      return { ok: true };
    },
    [seats]
  );

  // Libère une place
  const removeStudent = useCallback((seatId) => {
    setSeats((prev) => prev.map((s) => (s.id === seatId ? { ...s, student: null } : s)));
    return { ok: true };
  }, []);

  return { seats, occupied, free, total: TOTAL_SEATS, addStudent, updateStudent, removeStudent };
}