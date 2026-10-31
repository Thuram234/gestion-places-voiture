// Configuration du véhicule : Mercedes-Benz Sprinter, 26 places passagers
// 2 sièges à l'avant + 6 rangées de 4 (la dernière est la banquette du fond)
export const FRONT_SEATS = 2;
export const ROWS = 6;
export const SEATS_PER_ROW = 4;
export const TOTAL_SEATS = FRONT_SEATS + ROWS * SEATS_PER_ROW; // 26
export const STORAGE_KEY = "car-seats-v1";

// Tableau initial : 26 sièges numérotés de 1 à 26, tous libres
export const createEmptySeats = () =>
  Array.from({ length: TOTAL_SEATS }, (_, i) => ({ id: i + 1, student: null }));