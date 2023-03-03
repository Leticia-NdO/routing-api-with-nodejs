import { CoordinatesWithDistance } from '../domain/models/coordinates-with-distance'
import { Coordinate } from '../domain/models/coordinates'
import { TwoThirdsApproximationRouteMaker } from './two-thirds-approximation'
import { SpanningTreeMaker } from '../domain/services/spanning-tree-maker'
import { ApproximationAlgorithm } from '../domain/services/approximation-algorithm'
import { RoutePointWithSequence } from '../domain/models/route-point-with-sequence'

const makeFakeSpanningTree = (): CoordinatesWithDistance[] => {
  return [
    {
      source: {
        id: 1,
        lat: -23.606997872564072,
        lon: -46.76229420947422
      },
      destination: {
        id: 2,
        lat: -23.606997872564072,
        lon: -46.76229420947422
      },
      distance: 11
    },
    {
      source: {
        id: 3,
        lat: -23.606997872564072,
        lon: -46.76229420947422
      },
      destination: {
        id: 4,
        lat: -23.606997872564072,
        lon: -46.76229420947422
      },
      distance: 11
    }
  ]
}

const makeFakeRouteRequest = (): Coordinate[] => {
  return [
    {
      id: 1,
      lat: -1.555,
      lon: -1.555
    },
    {
      id: 2,
      lat: -1.666,
      lon: -1.666
    }
  ]
}

const makeFakeRoute = (): RoutePointWithSequence[] => {
  return [
    {
      coordinates: {
        id: 1,
        lat: -1.555,
        lon: -1.555
      },
      sequence: 1
    },
    {
      coordinates: {
        id: 2,
        lat: -1.666,
        lon: -1.666
      },
      sequence: 2
    }
  ]
}

interface SutTypes {
  sut: TwoThirdsApproximationRouteMaker
  spanningTreeMakerStub: SpanningTreeMaker
  approximationAlgorithmStub: ApproximationAlgorithm

}

const makeSpanningTreeMakerStub = (): SpanningTreeMaker => {
  class SpanningTreeMakerStub implements SpanningTreeMaker {
    async getTree (coordinates: Coordinate[]): Promise<CoordinatesWithDistance[]> {
      return await new Promise(resolve => resolve(makeFakeSpanningTree()))
    }
  }

  return new SpanningTreeMakerStub()
}

const makeApproximationAlgorithmStub = (): ApproximationAlgorithm => {
  class ApproximationAlgorithmStub implements ApproximationAlgorithm {
    getRoute (spanningTree: CoordinatesWithDistance[]): RoutePointWithSequence[] {
      return makeFakeRoute()
    }
  }

  return new ApproximationAlgorithmStub()
}

const makeSut = (): SutTypes => {
  const spanningTreeMakerStub = makeSpanningTreeMakerStub()
  const approximationAlgorithmStub = makeApproximationAlgorithmStub()
  const sut = new TwoThirdsApproximationRouteMaker(spanningTreeMakerStub, approximationAlgorithmStub)

  return {
    sut,
    spanningTreeMakerStub,
    approximationAlgorithmStub
  }
}

describe('TwoThirdsApproximationRouteMaker', () => {
  it('Should call SpanningTreeMaker with correct values', async () => {
    const { sut, spanningTreeMakerStub } = makeSut()

    const getSpy = jest.spyOn(spanningTreeMakerStub, 'getTree')

    await sut.calculateRoute(makeFakeRouteRequest())

    expect(getSpy).toHaveBeenCalledWith(makeFakeRouteRequest())
  })

  it('Should call ApproximationAlgorithm with correct values', async () => {
    const { sut, approximationAlgorithmStub } = makeSut()

    const getSpy = jest.spyOn(approximationAlgorithmStub, 'getRoute')

    await sut.calculateRoute(makeFakeRouteRequest())

    expect(getSpy).toHaveBeenCalledWith(makeFakeSpanningTree())
  })

  it('Should throw if SpanningTreeMaker throws', async () => {
    const { sut, spanningTreeMakerStub } = makeSut()

    jest.spyOn(spanningTreeMakerStub, 'getTree').mockReturnValueOnce(new Promise((resolve, reject) => {
      reject(new Error())
    }))

    const response = sut.calculateRoute(makeFakeRouteRequest())

    await expect(response).rejects.toThrow()
  })

  it('Should throw if ApproximationAlgorithm throws', async () => {
    const { sut, approximationAlgorithmStub } = makeSut()

    jest.spyOn(approximationAlgorithmStub, 'getRoute').mockImplementationOnce(() => {
      throw new Error()
    })

    const response = sut.calculateRoute(makeFakeRouteRequest())

    await expect(response).rejects.toThrow()
  })

  it('Should return a route on success', async () => {
    const { sut } = makeSut()

    const response = await sut.calculateRoute(makeFakeRouteRequest())

    expect(response).toEqual(makeFakeRoute())
  })
})
