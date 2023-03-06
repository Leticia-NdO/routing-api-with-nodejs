import { Coordinate } from '../../domain/models/coordinates'
import { RoutePointWithSequence } from '../../domain/models/route-point-with-sequence'

export interface ApproximateRouteCreator {
  calculateRoute: (points: Coordinate[], startingPointId: number) => Promise<RoutePointWithSequence[]>
}
