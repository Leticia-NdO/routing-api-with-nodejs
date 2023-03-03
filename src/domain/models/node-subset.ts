import { Coordinate } from './coordinates'

export interface NodeParents {
  parent: Coordinate
  rank: 0
}

export interface NodeSubset {
  node: Coordinate
}
