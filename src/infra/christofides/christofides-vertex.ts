import { Coordinate } from '../../domain/models'

export class ChristofidesVertex {
  private readonly neighbors: Coordinate[] = [] // Array to store the neighboring vertices
  private discovery: number = 0 // Discovery time during depth-first search
  private finish: number = 0 // Finish time during depth-first search
  private color: string = 'black' // Color used during depth-first search

  constructor (private readonly coordinates: Coordinate) {}

  addNeighbor (coordinates: Coordinate): void {
    if (!this.neighbors.includes(coordinates)) {
      this.neighbors.push(coordinates) // Add a neighboring vertex to the current vertex
    }
  }

  getId (): number {
    return this.coordinates.id // Get the ID of the vertex
  }

  setColor (color: string): void {
    this.color = color // Set the color of the vertex during depth-first search
  }

  getColor (): string {
    return this.color // Get the color of the vertex during depth-first search
  }

  setDiscoveryTime (discoveryTime: number): void {
    this.discovery = discoveryTime // Set the discovery time of the vertex during depth-first search
  }

  getDiscoveryTime (): number {
    return this.discovery // Get the discovery time of the vertex during depth-first search
  }

  setFinishTime (finishTime: number): void {
    this.finish = finishTime // Set the finish time of the vertex during depth-first search
  }

  getFinishTime (): number {
    return this.finish // Get the finish time of the vertex during depth-first search
  }

  getCoordinates (): Coordinate {
    return this.coordinates // Get the coordinates of the vertex
  }

  getNeighbors (): Coordinate[] {
    return this.neighbors // Get the neighboring vertices of the current vertex
  }
}
