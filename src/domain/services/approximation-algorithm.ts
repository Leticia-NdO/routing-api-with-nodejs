import { CoordinatesWithDistance } from '../models/coordinates-with-distance'
import { RoutePointWithSequence } from '../models/route-point-with-sequence'

export interface ApproximationAlgorithm {
  getRoute: (spanningTree: CoordinatesWithDistance[]) => RoutePointWithSequence[]
}
