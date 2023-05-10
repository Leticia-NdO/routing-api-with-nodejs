import { NodeParents } from '../../domain/models'
import { Coordinate } from '../../domain/models/coordinates'
import { CoordinatesWithDistance } from '../../domain/models/coordinates-with-distance'
import { SpanningTreeMaker } from '../../domain/services/spanning-tree-maker'
import { Graph } from './graph'

export class KrustalSpanningTree implements SpanningTreeMaker {
  async getTree (coordinates: Coordinate[]): Promise<CoordinatesWithDistance[]> {
    let i = 0
    let j = 0
    let cost = 0
    const subsets = new Map<Coordinate, NodeParents>()
    const result: CoordinatesWithDistance[] = []

    // Create an initial graph from the coordinates
    const graph = new Graph(coordinates)

    // Initialize subsets with each node as its own parent and rank 0
    graph.getNodes().forEach((node) => {
      subsets.set(node, { parent: node, rank: 0 })
    })

    while (j < coordinates.length - 1) {
      const edge = graph.getEdge(i++) // Get the next edge from the sorted list of edges
      const root1 = graph.findParent(subsets, edge.source) // Find the parent/root of the source node
      const root2 = graph.findParent(subsets, edge.destination) // Find the parent/root of the destination node

      // If the nodes don't create a cycle, add the edge to the final subgraph
      if (root1 !== root2) {
        result[j++] = edge
        cost += edge.distance // Update the total weight of the subgraph
        graph.union(subsets, root1, root2) // Union the subsets of the two nodes
      }
    }
    console.log('total distance: ', cost)

    return result // Return the minimum spanning tree (subgraph)
  }
}
