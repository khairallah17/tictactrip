import { IncomingMessage, ServerResponse } from "http"

// API ROUTES
import { justifyRoute } from "./routes/api/justify"
import { authRoute } from "./routes/api/auth"
import { healthCheckRoute } from "./routes/api/health"

import { readBody } from "./utils/readData"

export const handler = async (req: IncomingMessage, res: ServerResponse) => {
  
  const METHOD = req.method
  const url = new URL(`http://localhost${req.url}`)

  try {
    if (url.pathname.startsWith("/api")) { 

      if (METHOD === "POST") {
        
        const body = await readBody(req)
        
        switch (url.pathname) {
          case "/api/justify": justifyRoute(body, req.headers, res); return;
          case "/api/token": authRoute(body, res); return;
          default: break;
        }
        
      }

      if (METHOD === "GET" && url.pathname === "/api/health") {
        return healthCheckRoute(res) 
      }
  }

  } catch (error: any) {
    if (error.type && error.message) {
      res.writeHead(error.type, {"Content-Type":"Text/plain"})
      res.write(error.message as string)
      return res.end()
    }
    res.writeHead(500, {"Content-Type":"Text/plain"})
    res.write("Internal Server Error!")
    return res.end()
  }

  res.writeHead(404, {"Content-Type":"Text/plain"})
  res.write("NOT FOUND")
  return res.end()
}
