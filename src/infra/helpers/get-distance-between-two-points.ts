import { Coordinate } from '../../domain/models/coordinates'
import { CoordinatesWithDistance } from '../../domain/models/coordinates-with-distance'

export function getDistanceBetweenTwoPoints (source: Coordinate, destination: Coordinate): CoordinatesWithDistance {
  if (source.lat === destination.lat && source.lon === destination.lon) {
    return {
      source,
      destination,
      distance: 0
    }
  }

  const radlat1 = (Math.PI * source.lat) / 180
  const radlat2 = (Math.PI * destination.lat) / 180

  const theta = source.lon - destination.lon
  const radtheta = (Math.PI * theta) / 180

  let distance =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)

  if (distance > 1) {
    distance = 1
  }

  distance = Math.acos(distance)
  distance = (distance * 180) / Math.PI
  distance = distance * 60 * 1.1515
  distance = distance * 1.609344 // convert miles to km

  return {
    source,
    destination,
    distance
  }
}
