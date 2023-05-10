import { Coordinate } from '../domain/models/coordinates'
import { RoutePointWithSequence } from '../domain/models/route-point-with-sequence'
import { ApproximationAlgorithm } from '../domain/services/approximation-algorithm'
import { SpanningTreeMaker } from '../domain/services/spanning-tree-maker'
import { ApproximateRouteCreator } from './protocols/approximate-route-creator'

export class TwoThirdsApproximationRouteMaker implements ApproximateRouteCreator {
  constructor (
    private readonly spanningTreeMaker: SpanningTreeMaker,
    private readonly approximationAlgorithm: ApproximationAlgorithm
  ) {}

  async calculateRoute (points: Coordinate[], startingPointId: number): Promise<RoutePointWithSequence[]> {
    // Generate a minimum spanning tree using the specified spanning tree maker
    const spanningTree = await this.spanningTreeMaker.getTree(points)

    // Use the approximation algorithm to calculate the approximate route based on the spanning tree
    const route = this.approximationAlgorithm.getRoute(spanningTree, startingPointId)

    return route // Return the approximate route
  }
}
