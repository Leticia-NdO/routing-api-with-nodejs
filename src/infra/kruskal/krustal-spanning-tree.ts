import { NodeParents } from '../../domain/models'
import { Coordinate } from '../../domain/models/coordinates'
import { CoordinatesWithDistance } from '../../domain/models/coordinates-with-distance'
import { SpanningTreeMaker } from '../../domain/services/spanning-tree-maker'
import { Graph } from './graph'

export class KrustalSpanningTree implements SpanningTreeMaker {
  async getTree (coordinates: Coordinate[]): Promise<CoordinatesWithDistance[]> {
    let i = 0; let j = 0; let cost = 0
    const subsets = new Map<Coordinate, NodeParents>()
    const result: CoordinatesWithDistance[] = []

    // um grafo inicial deve ser gerado a partir somente dos vértices (Coordinate[])
    const graph = new Graph(coordinates)

    graph.getNodes().forEach(node => {
      subsets.set(node, { parent: node, rank: 0 })
    })

    i = 0
    while (j < coordinates.length - 1) {
      const edge = graph.getEdge(i++)
      const root1 = graph.findParent(subsets, edge.source)
      const root2 = graph.findParent(subsets, edge.destination)

      // if the nodes doesn't create a cycle then we add the edge to final subgraph
      if (root1 !== root2) {
        result[j++] = edge
        // update the total weight of the subgraph
        cost += edge.distance
        graph.union(subsets, root1, root2)
      }
    }
    console.log('total distance: ', cost)

    return result
  }
}
