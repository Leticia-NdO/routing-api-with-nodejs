import { CoordinatesWithDistance, RoutePointWithSequence } from '../../domain/models'
import { ApproximationAlgorithm } from '../../domain/services/approximation-algorithm'
import { getDistanceBetweenTwoPoints } from '../helpers/get-distance-between-two-points'
import { ChristofidesVertex } from './christofides-vertex'

export class ChristofidesApproximationAlgorithm implements ApproximationAlgorithm {
  private spanningTree: CoordinatesWithDistance[] // Represents the spanning tree
  private vertices: Map<number, ChristofidesVertex> = new Map() // Stores vertices of the graph
  private time = 0 // Used for DFS traversal

  getRoute (spanningTree: CoordinatesWithDistance[], startingPointId: number): RoutePointWithSequence[] {
    this.spanningTree = spanningTree
    this.generateVertices(spanningTree) // Generate the vertices from the spanning tree
    this.createChristofiderGraph(startingPointId) // Create the Christofides graph

    const vertices = this.getVertices() // Get the final vertices after DFS traversal
    return this.getFinalSequence(vertices) // Generate the final sequence of vertices
  }

  private createChristofiderGraph (startingPointId: number): void {
    const oddVertices = this.getOddVertices() // Get the odd degree vertices
    const minimumWeightMatching = this.getMinimumWeightMatching(oddVertices) // Calculate the minimum weight matching
    this.spanningTree = this.spanningTree.concat(minimumWeightMatching) // Add the matching edges to the spanning tree
    this.generateVertices(this.spanningTree) // Generate vertices from the updated spanning tree
    this.depthFirstSearch(this.vertices.get(startingPointId)!) // Perform depth-first search from the starting point
  }

  private generateVertices (spanningTree: CoordinatesWithDistance[]): void {
    for (let k = 0; k < spanningTree.length; k++) {
      const edge = spanningTree[k]
      const sourceDfsVertex = new ChristofidesVertex(edge.source) // Create a vertex for the source of the edge
      const destinationDfsVertex = new ChristofidesVertex(edge.destination) // Create a vertex for the destination of the edge
      this.addVertex(sourceDfsVertex) // Add the source vertex to the graph
      this.addVertex(destinationDfsVertex) // Add the destination vertex to the graph
      this.addEdge(edge) // Add the edge between the source and destination vertices
      this.vertices = new Map(
        [...this.vertices.entries()].sort(
          (a, b) => a[1].getNeighbors().length - b[1].getNeighbors().length
        )
      ) // Sort the vertices based on the number of neighbors
    }
  }

  private addVertex (vertex: ChristofidesVertex): void {
    if (!this.vertices?.has(vertex.getId())) {
      this.vertices.set(vertex.getId(), vertex) // Add the vertex to the graph if it doesn't already exist
    }
  }

  private addEdge (edge: CoordinatesWithDistance): void {
    if (this.vertices.has(edge.source.id) && this.vertices.has(edge.destination.id)) {
      // Check if the vertices of the edge exist in the graph
      for (const [key, value] of this.vertices) {
        if (key === edge.source.id) {
          value.addNeighbor(edge.destination) // Add the destination as a neighbor of the source
        }

        if (key === edge.destination.id) {
          value.addNeighbor(edge.source) // Add the source as a neighbor of the destination
        }
      }
    }
  }

  private removeVertex (id: number): void {
    this.vertices.delete(id) // Remove a vertex from the graph by its ID
  }

  private getVertices (): Map<number, ChristofidesVertex> {
    return this.vertices // Get all vertices in the graph
  }

  private getOddVertices (): ChristofidesVertex[] {
    const possibleStartingIds: ChristofidesVertex[] = []
    for (const value of this.vertices.values()) {
      if (value.getNeighbors().length % 2 !== 0) {
        possibleStartingIds.push(value) // Collect vertices with odd degrees
      }
    }

    return possibleStartingIds
  }

  private getMinimumWeightMatching (oddVertices: ChristofidesVertex[]): CoordinatesWithDistance[] {
    const allOddEdges: CoordinatesWithDistance[] = []
    const minimumWeightMatching: CoordinatesWithDistance[] = []

    // Generate all edges between odd degree vertices
    for (let k = 0; k < oddVertices.length; k++) {
      const origin = oddVertices[k]
      for (let w = 0; w < oddVertices.length; w++) {
        const destiny = oddVertices[w]
        const distanceBetweenTwoPoints = getDistanceBetweenTwoPoints(
          origin.getCoordinates(),
          destiny.getCoordinates()
        )
        if (distanceBetweenTwoPoints.distance === 0) continue // Skip if the origin and destiny are the same
        allOddEdges.push(distanceBetweenTwoPoints)
      }
    }

    for (let k = 0; k < oddVertices.length; k++) {
      const existingMinimumEdge = minimumWeightMatching.filter((edge) => {
        return (
          edge.source.id === oddVertices[k].getId() ||
          edge.destination.id === oddVertices[k].getId()
        )
      })

      if (existingMinimumEdge.length > 0) continue

      const allVerticesMinimumEdges = allOddEdges.filter((edge) => {
        return (
          edge.destination === oddVertices[k].getCoordinates() ||
          edge.source === oddVertices[k].getCoordinates()
        )
      })

      allVerticesMinimumEdges.sort((a, b) => a.distance - b.distance)

      for (let k = 0; k < allVerticesMinimumEdges.length; k++) {
        const shortestPath = allVerticesMinimumEdges[k]
        if (
          minimumWeightMatching.find((item) => {
            return (
              item.destination.id === shortestPath.destination.id ||
              item.source.id === shortestPath.source.id ||
              item.source.id === shortestPath.destination.id ||
              item.destination.id === shortestPath.source.id
            )
          })
        ) { continue } // Skip if the edge is already present in the minimum weight matching

        minimumWeightMatching.push(shortestPath) // Add the shortest path to the minimum weight matching
      }
    }

    return minimumWeightMatching
  }

  private depthFirstSearch (initialVertex: ChristofidesVertex): void {
    this.time = 1
    this.dfs(initialVertex) // Perform depth-first search traversal
  }

  private dfs (vertex: ChristofidesVertex): void {
    vertex.setColor('red') // Mark the vertex as visited (red color)
    vertex.setDiscoveryTime(this.time)
    this.time += 1
    const vertexNeighbors = vertex.getNeighbors()
    for (let k = 0; k < vertexNeighbors.length; k++) {
      const neighbor = this.vertices.get(vertexNeighbors[k].id)
      if (neighbor?.getColor() === 'black') {
        this.dfs(neighbor) // Recursively visit unvisited neighbors
      }
    }

    vertex.setColor('blue') // Mark the vertex as finished (
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

    this.cleanVertices() // Clean up the graph vertices
    return finalRoute
  }

  private cleanVertices (): void {
    this.vertices = new Map() // Reset the vertices map
  }
}
