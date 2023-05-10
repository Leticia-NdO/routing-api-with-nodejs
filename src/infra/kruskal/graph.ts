import { NodeParents } from '../../domain/models'
import { Coordinate } from '../../domain/models/coordinates'
import { CoordinatesWithDistance } from '../../domain/models/coordinates-with-distance'
import { getDistanceBetweenTwoPoints } from '../helpers/get-distance-between-two-points'

export class Graph {
  private readonly edges: CoordinatesWithDistance[] // Array to store the edges between nodes
  constructor (private readonly nodes: Coordinate[]) {
    const routes: CoordinatesWithDistance[] = []

    // Generate edges between all nodes
    for (let k = 0; k < nodes.length; k++) {
      const origin = nodes[k]
      for (let w = 0; w < nodes.length; w++) {
        const destiny = nodes[w]
        const distanceBetweenTwoPoints = getDistanceBetweenTwoPoints(origin, destiny)
        if (distanceBetweenTwoPoints.distance === 0) continue // Skip edges with distance 0 (same origin and destiny)
        routes.push(distanceBetweenTwoPoints)
      }
    }

    this.edges = routes.sort((a, b) => a.distance - b.distance) // Sort the edges by distance
  }

  addEdge (edge: CoordinatesWithDistance): void {
    this.edges.push(edge) // Add an edge to the graph
    if (!this.nodes.includes(edge.source)) {
      this.nodes.push(edge.source) // Add the source node to the graph if it doesn't exist
    }
    if (!this.nodes.includes(edge.destination)) {
      this.nodes.push(edge.destination) // Add the destination node to the graph if it doesn't exist
    }
  }

  getEdge (index: number): CoordinatesWithDistance {
    return this.edges[index] // Get the edge at the specified index
  }

  getEdges (): CoordinatesWithDistance[] {
    return this.edges // Get all edges in the graph
  }

  getNodes (): Coordinate[] {
    return this.nodes // Get all nodes in the graph
  }

  // Find the parent/root of a node using path compression
  findParent (subsets: Map<Coordinate, NodeParents>, node: Coordinate): Coordinate {
    const nodeInfo = subsets.get(node)
    if (nodeInfo && nodeInfo.parent !== node) {
      nodeInfo.parent = this.findParent(subsets, nodeInfo.parent)
    }
    return nodeInfo!.parent
  }

  // Union of two subsets based on rank
  union (subsets: Map<Coordinate, NodeParents>, nodeOne: Coordinate, nodeTwo: Coordinate): void {
    const nodeOneRoot = this.findParent(subsets, nodeOne)
    const nodeTwoRoot = this.findParent(subsets, nodeTwo)

    const nodeOneSubset = subsets.get(nodeOneRoot)
    const nodeTwoSubset = subsets.get(nodeTwoRoot)
    if (nodeOneSubset && nodeTwoSubset) {
      if (nodeOneSubset.rank < nodeTwoSubset.rank) {
        nodeOneSubset.parent = nodeTwoRoot
      } else if (nodeOneSubset.rank > nodeTwoSubset.rank) {
        nodeTwoSubset.parent = nodeOneRoot
      } else {
        nodeTwoSubset.parent = nodeOneRoot
        nodeOneSubset.rank++
      }
    }
  }
}
