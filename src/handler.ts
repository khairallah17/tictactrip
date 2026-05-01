import { IncomingMessage, ServerResponse } from "http"

export const handler = (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, {"Content-Type":"Text/plain"})
  res.write("API WORKING!")
  res.end()
}
