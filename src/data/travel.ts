export type TravelPlace = {
  label: string;
  x: number;
  y: number;
  note?: string;
};

export const travelPlaces: TravelPlace[] = [
  { label: "Italy", x: 53.21, y: 23.57 },
  { label: "Denmark", x: 51.69, y: 19.55 },
  { label: "Cancun, Mexico", x: 26.09, y: 36.48 },
  { label: "California", x: 18.61, y: 27.02 },
  { label: "Woodinville, WA", x: 19.51, y: 20.45, note: "Where I grew up" },
  { label: "Butte, MT", x: 21.65, y: 21.49, note: "College years" },
  { label: "Philadelphia, PA", x: 30.5, y: 25.1, note: "Current home" },
  { label: "Washington, D.C.", x: 30.02, y: 25.33 },
  { label: "Fort Collins, CO", x: 23.13, y: 24.41 },
];
