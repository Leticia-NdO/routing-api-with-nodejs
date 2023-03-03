import { RouteController } from '../../../presentation/controllers/route-controller'
import { Controller } from '../../../presentation/protocols'
import { makeTwoThirdsApproximationRouteMaker } from '../services/two-thirds-approximation-route-maker-factory'

export const makeRouteController = (): Controller => {
  const approximateRouteCreator = makeTwoThirdsApproximationRouteMaker()
  const routeController = new RouteController(approximateRouteCreator)
  return routeController
}
