import { Coordinate } from '../models/coordinates'
import { CoordinatesWithDistance } from '../models/coordinates-with-distance'

export interface SpanningTreeMaker {
  getTree: (coordinates: Coordinate[]) => Promise<CoordinatesWithDistance[]>
}
