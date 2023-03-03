import { Coordinate } from '../../domain/models'

export class ChristofidesVertex {
  private readonly neighbors: Coordinate[] = []
  private discovery: number = 0
  private finish: number = 0
  private color: string = 'black'

  constructor (
    private readonly coordinates: Coordinate
  ) {}

  addNeighbor (coordinates: Coordinate): void {
    if (!this.neighbors.includes(coordinates)) {
      this.neighbors.push(coordinates)
    }
  }

  getId (): number {
    return this.coordinates.id
  }

  setColor (color: string): void {
    this.color = color
  }

  getColor (): string {
    return this.color
  }

  setDiscoveryTime (discoveryTime: number): void {
    this.discovery = discoveryTime
  }

  getDiscoveryTime (): number {
    return this.discovery
  }

  setFinishTime (finishTime: number): void {
    this.finish = finishTime
  }

  getFinishTime (): number {
    return this.finish
  }

  getCoordinates (): Coordinate {
    return this.coordinates
  }

  getNeighbors (): Coordinate[] {
    return this.neighbors
  }
}
