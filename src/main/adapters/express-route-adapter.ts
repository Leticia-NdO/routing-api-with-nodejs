import { Controller, HttpRequest } from '../../presentation/protocols'
import { Request, Response } from 'express'

// Function to adapt a route handler for Express
export const adaptRoute = (controller: Controller) => {
  // Return an async function that acts as the adapted route handler
  return async (req: Request, res: Response): Promise<void> => {
    // Create an instance of HttpRequest using the request body
    const httpRequest: HttpRequest = {
      body: req.body
    }

    // Call the controller's handle function passing the httpRequest
    const httpResponse = await controller.handle(httpRequest)

    // Check if the httpResponse status code is within the range of 200 to 299 (successful response)
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      // Set the status code and send the body of the httpResponse as the response
      res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      // If the status code is outside the range, set the corresponding status code on the Express response
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
