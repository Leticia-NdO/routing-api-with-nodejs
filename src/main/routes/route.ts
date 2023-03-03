import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeRouteController } from '../factories/controllers/route-controller-factory'

export default (router: Router): void => {
  router.post('/route', adaptRoute(makeRouteController()))
}
