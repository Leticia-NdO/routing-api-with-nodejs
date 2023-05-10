import { HttpRequest, Middleware } from '../../presentation/protocols'
import { NextFunction, Request, Response } from 'express'

// Function to adapt middleware for Express
export const adaptMiddleware = (middleware: Middleware) => {
  // Return an async function that acts as the adapted middleware
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Create an instance of HttpRequest using the request headers
    const httpRequest: HttpRequest = {
      headers: req.headers
    }

    // Call the middleware's handle function passing the httpRequest
    const httpResponse = await middleware.handle(httpRequest)

    // Check if the middleware response has a status code of 200 (OK)
    if (httpResponse.statusCode === 200) {
      // Assign the body of the httpResponse to the Express request object
      Object.assign(req, httpResponse.body)
      // Call the next function to proceed to the next middleware or route handler
      next()
    } else {
      // If the status code is not 200, set the corresponding status code on the Express response
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
