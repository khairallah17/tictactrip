import { IncomingMessage } from "http" 

export async function readBody(req: IncomingMessage): Promise<Record<string, string>> {
  return new Promise<Record<string, string>>((resolve, reject) => {
    
    let strBody: string = ""
    let jsonBody: Object = {}
    
    // reading body data from the readable stream
    req.on("readable", () => {
      strBody += req.read()
    })

    // handling the return value for the json body
    req.on("end", () => {
      // remove (null) at the end of the strBody
      strBody = strBody.split("null").join("")
      jsonBody = JSON.parse(strBody)
      resolve(jsonBody as Record<string, string>)
    })

    // error handling
    req.on("error", () => {
      reject()
    })

  })
}
