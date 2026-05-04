import { ServerResponse } from "http"

export const healthCheckRoute = (res: ServerResponse) => {

  res.writeHead(200, {"Content-Type":"text/plain"})
  res.write("API WORKING!")
  return res.end()

}
