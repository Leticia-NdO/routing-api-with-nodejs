import { ApproximateRouteCreator } from '../../../data/protocols/approximate-route-creator'
import { TwoThirdsApproximationRouteMaker } from '../../../data/two-thirds-approximation'
import { ChristofidesApproximationAlgorithm } from '../../../infra/christofides/christofides-approximation-algorithm'
import { KrustalSpanningTree } from '../../../infra/kruskal/krustal-spanning-tree'

export const makeTwoThirdsApproximationRouteMaker = (): ApproximateRouteCreator => {
  const spanningTreeMaker = new KrustalSpanningTree()
  const approximationAlgorithm = new ChristofidesApproximationAlgorithm()
  const twoThirdsApproximation = new TwoThirdsApproximationRouteMaker(spanningTreeMaker, approximationAlgorithm)
  return twoThirdsApproximation
}
