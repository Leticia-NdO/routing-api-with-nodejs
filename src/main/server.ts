
import env from './config/env'
import * as app from '../main/config/app'

app.default.listen(env.port, () => {
  console.log(`Server running at port:${env.port}`)
})
