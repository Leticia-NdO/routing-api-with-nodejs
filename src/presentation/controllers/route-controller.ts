import { ApproximateRouteCreator } from '../../data/protocols/approximate-route-creator'
import {
  badRequest,
  ok,
  serverError,
  Controller,
  HttpRequest,
  HttpResponse,
  InvalidParamError,
  MissingParamError
} from './route-controller-protocols'

export class RouteController implements Controller {
  constructor (private readonly approximateRouteCreator: ApproximateRouteCreator) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      // Destructure the coordinates and startingPointId from the request body
      const { coordinates, startingPointId } = httpRequest.body

      // Measure the time taken for route calculation using console.time
      console.time(`Route calculation of ${coordinates.length as number} points`)

      // Check if startingPointId is missing
      if (!startingPointId) {
        return badRequest(new MissingParamError('Starting Point'))
      }

      // Check if the starting point is present in the coordinates list
      if (!coordinates.find((point) => point.id === startingPointId)) {
        return badRequest(new InvalidParamError('Starting Point', startingPointId))
      }

      // Iterate over each coordinate and validate the latitude and longitude values
      for (const coordinate of coordinates) {
        if (coordinate.lat < -90 || coordinate.lat > 90) {
          return badRequest(new InvalidParamError('lat', coordinate.id))
        }

        if (coordinate.lon < -180 || coordinate.lat > 180) {
          return badRequest(new InvalidParamError('lon', coordinate.id))
        }
      }

      // Call the approximateRouteCreator to calculate the route with the provided coordinates and startingPointId
      const approximatedRoute = await this.approximateRouteCreator.calculateRoute(coordinates, startingPointId)

      // Measure the end time of route calculation using console.timeEnd
      console.timeEnd(`Route calculation of ${coordinates.length as number} points`)

      // Return the calculated route as a successful response
      return ok(approximatedRoute)
    } catch (error) {
      // If an error occurs during the route calculation, return a server error response
      return serverError(error)
    }
  }
}
