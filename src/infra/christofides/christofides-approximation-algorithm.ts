import { CoordinatesWithDistance, RoutePointWithSequence } from '../../domain/models'
import { ApproximationAlgorithm } from '../../domain/services/approximation-algorithm'
import { getDistanceBetweenTwoPoints } from '../helpers/get-distance-between-two-points'
import { ChristofidesVertex } from './christofides-vertex'

export class ChristofidesApproximationAlgorithm implements ApproximationAlgorithm {
  private spanningTree: CoordinatesWithDistance[]
  private vertices: Map<number, ChristofidesVertex> = new Map()
  private time = 0

  getRoute (spanningTree: CoordinatesWithDistance[], startingPointId: number): RoutePointWithSequence[] {
    this.spanningTree = spanningTree
    this.generateVertices(spanningTree)
    this.createChristofiderGraph(startingPointId)

    const vertices = this.getVertices()
    return this.getFinalSequence(vertices)
  }

  private createChristofiderGraph (startingPointId: number): void {
    const oddVertices = this.getOddVertices()
    const minimumWeightMatching = this.getMinimumWeightMatching(oddVertices)
    this.spanningTree = this.spanningTree.concat(minimumWeightMatching)
    this.generateVertices(this.spanningTree)
    this.depthFirstSearch(this.vertices.get(startingPointId)!) // aqui colocamos o id do ponto inicial
  }

  private generateVertices (spanningTree: CoordinatesWithDistance[]): void {
    for (let k = 0; k < spanningTree.length; k++) {
      const edge = spanningTree[k]
      const sourceDfsVertex = new ChristofidesVertex(edge.source)
      const destinationDfsVertex = new ChristofidesVertex(edge.destination)
      this.addVertex(sourceDfsVertex)
      this.addVertex(destinationDfsVertex)
      this.addEdge(edge)
      this.vertices = new Map([...this.vertices.entries()].sort((a, b) => a[1].getNeighbors().length - b[1].getNeighbors().length))
    }
  }

  private addVertex (vertex: ChristofidesVertex): void {
    if (!this.vertices?.has(vertex.getId())) {
      this.vertices.set(vertex.getId(), vertex)
    }
  }

  private addEdge (edge: CoordinatesWithDistance): void {
    if (this.vertices.has(edge.source.id) && this.vertices.has(edge.destination.id)) {
      for (const [key, value] of this.vertices) {
        if (key === edge.source.id) {
          value.addNeighbor(edge.destination)
        }

        if (key === edge.destination.id) {
          value.addNeighbor(edge.source)
        }
      }
    }
  }

  private removeVertex (id: number): void {
    this.vertices.delete(id)
  }

  private getVertices (): Map<number, ChristofidesVertex> {
    return this.vertices
  }

  private getOddVertices (): ChristofidesVertex[] {
    const possibleStartingIds: ChristofidesVertex[] = []
    for (const value of this.vertices.values()) {
      if (value.getNeighbors().length % 2 !== 0) {
        possibleStartingIds.push(value)
      }
    }

    return possibleStartingIds
  }

  private getMinimumWeightMatching (oddVertices: ChristofidesVertex[]): CoordinatesWithDistance[] {
    const allOddEdges: CoordinatesWithDistance[] = []
    const minimumWeightMatching: CoordinatesWithDistance[] = []

    for (let k = 0; k < oddVertices.length; k++) {
      const origin = oddVertices[k]
      for (let w = 0; w < oddVertices.length; w++) {
        const destiny = oddVertices[w]
        const distanceBetweenTwoPoints = getDistanceBetweenTwoPoints(origin.getCoordinates(), destiny.getCoordinates())
        if (distanceBetweenTwoPoints.distance === 0) continue // if the origin and destiny are the same
        allOddEdges.push(distanceBetweenTwoPoints)
      }
    }

    for (let k = 0; k < oddVertices.length; k++) {
      const existingMinimumEdge = minimumWeightMatching.filter((edge) => {
        return edge.source.id === oddVertices[k].getId() || edge.destination.id === oddVertices[k].getId()
      })

      if (existingMinimumEdge.length > 0) continue

      const allVerticesMinimumEdges = allOddEdges.filter((edge) => {
        return edge.destination === oddVertices[k].getCoordinates() || edge.source === oddVertices[k].getCoordinates()
      })

      allVerticesMinimumEdges.sort((a, b) => a.distance - b.distance)

      for (let k = 0; k < allVerticesMinimumEdges.length; k++) {
        const shortestPath = allVerticesMinimumEdges[k]
        if (minimumWeightMatching.find((item) => {
          return item.destination.id === shortestPath.destination.id || item.source.id === shortestPath.source.id || item.source.id === shortestPath.destination.id || item.destination.id === shortestPath.source.id
        })) continue

        minimumWeightMatching.push(shortestPath)
      }
    }

    return minimumWeightMatching
  }

  private depthFirstSearch (initialVertex: ChristofidesVertex): void {
    this.time = 1
    this.dfs(initialVertex)
  }

  private dfs (vertex: ChristofidesVertex): void {
    vertex.setColor('red')
    vertex.setDiscoveryTime(this.time)
    this.time += 1
    const vertexNeighbors = vertex.getNeighbors()
    for (let k = 0; k < vertexNeighbors.length; k++) {
      const neighbor = this.vertices.get(vertexNeighbors[k].id)
      if (neighbor?.getColor() === 'black') {
        this.dfs(neighbor)
      }
    }

    vertex.setColor('blue')
    vertex.setFinishTime(this.time)
    this.time += 1
  }

  private getFinalSequence (verticesMap: Map<number, ChristofidesVertex>): RoutePointWithSequence[] {
    const finalRoute: RoutePointWithSequence[] = []
    let sequence = 0
    const sortedMap = new Map([...verticesMap.entries()].sort((a, b) => a[1].getDiscoveryTime() - b[1].getDiscoveryTime()))
    for (const value of sortedMap.values()) {
      finalRoute.push({
        coordinates: value.getCoordinates(),
        sequence: sequence += 1
      })
    }

    this.cleanVertices()
    return finalRoute
  }

  private cleanVertices (): void {
    this.vertices = new Map()
  }
}
