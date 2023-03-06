import { Coordinate } from '../domain/models/coordinates'
import { RoutePointWithSequence } from '../domain/models/route-point-with-sequence'
import { ApproximationAlgorithm } from '../domain/services/approximation-algorithm'
import { SpanningTreeMaker } from '../domain/services/spanning-tree-maker'
import { ApproximateRouteCreator } from './protocols/approximate-route-creator'

export class TwoThirdsApproximationRouteMaker implements ApproximateRouteCreator {
  constructor (private readonly spanningTreeMaker: SpanningTreeMaker, private readonly approximationAlgorithm: ApproximationAlgorithm) {}
  async calculateRoute (points: Coordinate[], staringPointId: number): Promise<RoutePointWithSequence[]> {
    const spanningTree = await this.spanningTreeMaker.getTree(points)
    const route = this.approximationAlgorithm.getRoute(spanningTree, staringPointId)
    return route
  }
}
