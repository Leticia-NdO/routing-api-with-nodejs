import { NodeParents } from '../../domain/models'
import { Coordinate } from '../../domain/models/coordinates'
import { CoordinatesWithDistance } from '../../domain/models/coordinates-with-distance'
import { getDistanceBetweenTwoPoints } from '../helpers/get-distance-between-two-points'

export class Graph {
  private readonly edges: CoordinatesWithDistance[]
  constructor (private readonly nodes: Coordinate[]) {
    const routes: CoordinatesWithDistance[] = []

    // transforma as coordenadas em CoordinatesWithDistance, tira as distancias iguais a 0 e distâncias repetidas
    for (let k = 0; k < nodes.length; k++) {
      const origin = nodes[k]
      for (let w = 0; w < nodes.length; w++) {
        const destiny = nodes[w]
        const distanceBetweenTwoPoints = getDistanceBetweenTwoPoints(origin, destiny)
        if (distanceBetweenTwoPoints.distance === 0) continue // if the origin and destiny are the same
        // routes = routes.filter( obj => {
        //   return obj.distance !== distanceBetweenTwoPoints.distance
        // })
        routes.push(distanceBetweenTwoPoints)
      }
    }

    this.edges = routes.sort((a, b) => a.distance - b.distance)
  }

  addEdge (edge: CoordinatesWithDistance): void {
    this.edges.push(edge)
    if (!this.nodes.includes(edge.source)) {
      this.nodes.push(edge.source)
    }
    if (!this.nodes.includes(edge.destination)) {
      this.nodes.push(edge.destination)
    }
  }

  getEdge (index: number): CoordinatesWithDistance {
    return this.edges[index]
  }

  getEdges (): CoordinatesWithDistance[] {
    return this.edges
  }

  getNodes (): Coordinate[] {
    return this.nodes
  }

  // get the root of node
  findParent (subsets: Map<Coordinate, NodeParents>, node: Coordinate): Coordinate {
    const nodeInfo = subsets.get(node)
    if (nodeInfo && nodeInfo.parent !== node) {
      nodeInfo.parent = this.findParent(subsets, nodeInfo.parent)
    }
    return nodeInfo!.parent
  }

  // unite the x and y subsets based on rank
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
