import { IncomingMessage, ServerResponse } from "http"
import { parseJsonFields } from "./utils/parse"
import { justifyText } from "./utils/justify"

async function readBody(req: IncomingMessage): Promise<Record<string, string>> {
  return new Promise<Record<string, string>>((resolve, reject) => {
    
    let strBody: string = ""
    let jsonBody: Object = {}
    
    // reading body data from the readable stream
    req.on("readable", () => {
      console.log("READING STREAM STARTED")
      strBody += req.read()
    })

    // handling the return value for the json body
    req.on("end", () => {
      console.log("END OF STREAM")
      strBody = strBody.split("null").join("")
      jsonBody = JSON.parse(strBody)
      resolve(jsonBody as Record<string, string>)
    })

    // error handling
    req.on("error", () => {
      console.log("STREAM ERROR")
      reject()
    })

  })
}

export const handler = async (req: IncomingMessage, res: ServerResponse) => {
  
  const METHOD = req.method
  const url = new URL(`http://localhost${req.url}`)

  try {
    if (url.pathname.startsWith("/api")) { 

      if (METHOD === "POST" && url.pathname === "/api/justify") {
        
        const body = await readBody(req)

        const { text } = parseJsonFields<{ text: string }>(body, [{field: "text", size: 80000}])
        const justifiedText = justifyText(text)

        res.writeHead(200, {"Content-Type":"Text/plain"})
        res.write(justifiedText)
        return res.end()
      }

      if (METHOD === "GET" && url.pathname === "/api/health") {
        res.writeHead(200, {"Content-Type":"Text/plain"})
        res.write("API WORKING!")
        return res.end()
      }
  }

  } catch (error: any) {
    if (error.type && error.message) {
      res.writeHead(error.type, {"Content-Type":"Text/plain"})
      res.write(error.message as string)
      return res.end()
    }
  }

  res.writeHead(404, {"Content-Type":"Text/plain"})
  res.write("NOT FOUND")
  return res.end()
}
