import { VehicleType } from "../types";

export interface ICalculateService {
  calculateDistanceInKm: (source: [number, number], destination: [number, number]) => number;
  calculateFare: (distance: number,vehicleType: VehicleType) => number
}