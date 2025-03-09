import { VehicleType } from "../types";
import { ICalculateService } from "./ICalculateSetrvice";

export class CalculateService implements ICalculateService {
  calculateDistanceInKm(source: [number, number], destination: [number, number]) {
    const earthRadius = 6371; // Radius of the Earth in kilometers
    const toRadians = (degrees: number) => degrees * Math.PI / 180;
    const [pickupLong, pickupLat] = source
    const [dropLong, dropLat] = destination

    const lat1 = toRadians(pickupLat);
    const lon1 = toRadians(pickupLong);
    const lat2 = toRadians(dropLat);
    const lon2 = toRadians(dropLong);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    // Haversine formula
    // a = sin²(Δφ) + cos φ₁ * cos φ₂ * sin²(Δλ)
    // c = 2 * atan2(√a, √(1−a))
    // d = R * c
    // where φ is latitude, λ is longitude, R is the earth’s radius (mean radius = 6,371 km)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance;
  }

  calculateFare(distance: number,vehicleType:VehicleType) {
    const rateBasedOnVehicleType = () : number =>{
      switch (vehicleType) {
        case VehicleType.BIKE:
          return 50;
        case VehicleType.AUTO:
          return 60;
        case VehicleType.TOTO:
          return 70;
        default:
          return 90;
      }
    }
    let RATE_PER_KM = rateBasedOnVehicleType();
    const date = new Date();
    const currentTine = date.getHours();
    if (currentTine >= 22 || currentTine <= 6) {
      RATE_PER_KM = RATE_PER_KM + (RATE_PER_KM * 0.2); // 20% night surcharge
    }
    return distance * RATE_PER_KM;
  }
}