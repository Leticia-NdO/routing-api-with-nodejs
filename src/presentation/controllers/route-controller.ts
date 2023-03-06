import { ApproximateRouteCreator } from '../../data/protocols/approximate-route-creator'
import { badRequest, ok, serverError, Controller, HttpRequest, HttpResponse, InvalidParamError } from './route-controller-protocols'

export class RouteController implements Controller {
  constructor (private readonly approximateRouteCreator: ApproximateRouteCreator) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { coordinates, startingPointId } = httpRequest.body
      console.time(`route calculation of ${coordinates.length as number}`)

      if (!coordinates.find(point => point.id === startingPointId)) {
        return badRequest(new InvalidParamError('Staring Point', startingPointId))
      }

      for (const coordinate of coordinates) {
        if (coordinate.lat < -90 || coordinate.lat > 90) {
          return badRequest(new InvalidParamError('lat', coordinate.id))
        }

        if (coordinate.lon < -180 || coordinate.lat > 180) {
          return badRequest(new InvalidParamError('lon', coordinate.id))
        }
      }

      const approximatedRoute = await this.approximateRouteCreator.calculateRoute(coordinates, startingPointId)
      console.timeEnd('route calculation')
      return ok(approximatedRoute)
    } catch (error) {
      return serverError(error)
    }
  }
}
