import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import path from 'path'

// Function to configure routes for the app
export default (app: Express): void => {
  const router = Router()

  // Mount the router under the '/api/v1' base path
  app.use('/api/v1', router)

  // Read the files in the routes directory and map over them
  readdirSync(path.join(`${__dirname}`, '/../routes')).map(async (file) => {
    // Check if the file name does not include '.test.'
    if (!file.includes('.test.')) {
      // Dynamically import the route file and call its default export with the router
      (await import(`../routes/${file}`)).default(router)
    }
  })
}
