import { Coordinate } from '../../domain/models/coordinates'
import { RoutePointWithSequence } from '../../domain/models/route-point-with-sequence'
import { HttpRequest } from '../protocols'
import { RouteController } from './route-controller'
import { ApproximateRouteCreator } from '../../data/protocols/approximate-route-creator'
import { InvalidParamError } from '../errors'
import { serverError } from './route-controller-protocols'

interface SutTypes {
  sut: RouteController
  approximateRouteCreatorStub: ApproximateRouteCreator
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

const makeFakeRouteRequest = (): HttpRequest => {
  return {
    body: {
      coordinates: [
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
      ],
      startingPointId: 1
    }

  }
}

const makeApproximateRouteCreatorStub = (): ApproximateRouteCreator => {
  class ApproximateRouteCreatorStub implements ApproximateRouteCreator {
    async calculateRoute (points: Coordinate[]): Promise<RoutePointWithSequence[]> {
      return await new Promise(resolve => resolve(makeFakeRoute()))
    }
  }

  return new ApproximateRouteCreatorStub()
}

const makeSut = (): SutTypes => {
  const approximateRouteCreatorStub = makeApproximateRouteCreatorStub()
  const sut = new RouteController(approximateRouteCreatorStub)

  return {
    sut,
    approximateRouteCreatorStub
  }
}

describe('Routecontroller', () => {
  it('Should call ApproximateRouteCreator with correct values', async () => {
    const { sut, approximateRouteCreatorStub } = makeSut()

    const calculateSpy = jest.spyOn(approximateRouteCreatorStub, 'calculateRoute')

    await sut.handle(makeFakeRouteRequest())

    expect(calculateSpy).toHaveBeenCalledWith(makeFakeRouteRequest().body.coordinates, makeFakeRouteRequest().body.startingPointId)
  })

  it('Should return 400 if invalid coordinates are provided', async () => {
    const { sut } = makeSut()
    const fakeHttpRequest = makeFakeRouteRequest()

    fakeHttpRequest.body.coordinates[0] = {
      id: 1,
      lat: -100,
      lon: -1
    }

    const response = await sut.handle(fakeHttpRequest)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual(new InvalidParamError('lat', 1))
  })

  it('Should return 400 if provided starting point id does not exist in provided coordinates list', async () => {
    const { sut } = makeSut()
    const fakeHttpRequest = makeFakeRouteRequest()

    fakeHttpRequest.body.startingPointId = 5

    const response = await sut.handle(fakeHttpRequest)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual(new InvalidParamError('Staring Point', 5))
  })

  it('Should return 500 if ApproximateRouteCreator throws', async () => {
    const { sut, approximateRouteCreatorStub } = makeSut()

    jest.spyOn(approximateRouteCreatorStub, 'calculateRoute').mockImplementationOnce(() => {
      throw new Error('error')
    })

    const res = await sut.handle(makeFakeRouteRequest())

    expect(res).toEqual(serverError(new Error('error')))
  })

  it('Should return 200 on success', async () => {
    const { sut } = makeSut()

    const res = await sut.handle(makeFakeRouteRequest())

    expect(res.statusCode).toEqual(200)
    expect(res.body.data).toEqual(makeFakeRoute())
  })
})
