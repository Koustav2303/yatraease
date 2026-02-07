export const cities = [
  { name: "New Delhi", code: "DEL", type: "Metro", isAirport: true, isTrain: true },
  { name: "Mumbai", code: "BOM", type: "Metro", isAirport: true, isTrain: true },
  { name: "Bengaluru", code: "BLR", type: "Metro", isAirport: true, isTrain: true },
  { name: "Kolkata", code: "CCU", type: "Metro", isAirport: true, isTrain: true },
  { name: "Chennai", code: "MAA", type: "Metro", isAirport: true, isTrain: true },
  { name: "Pune", code: "PNQ", type: "City", isAirport: true, isTrain: true },
  { name: "Hyderabad", code: "HYD", type: "Metro", isAirport: true, isTrain: true },
  { name: "Goa", code: "GOI", type: "Tourist", isAirport: true, isTrain: true },
  { name: "Jaipur", code: "JAI", type: "Tourist", isAirport: true, isTrain: true },
  { name: "Varanasi", code: "VNS", type: "Religious", isAirport: true, isTrain: true },
  { name: "Ayodhya", code: "AYD", type: "Religious", isAirport: true, isTrain: true },
  { name: "Agra", code: "AGR", type: "Tourist", isAirport: false, isTrain: true },
  { name: "Manali", code: "KUU", type: "Tourist", isAirport: true, isTrain: false },
];

export const getFareTrend = (date) => {
  if(!date) return null;
  const day = new Date(date).getDay();
  // 0 is Sunday, 6 is Saturday. Weekends are expensive.
  if (day === 0 || day === 6) return { label: "High Demand", color: "text-red-600", icon: "📈" };
  if (day === 5) return { label: "Filling Fast", color: "text-orange-600", icon: "⚡" };
  return { label: "Lowest Price", color: "text-green-600", icon: "💰" };
};