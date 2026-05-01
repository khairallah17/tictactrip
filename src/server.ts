import { createServer } from "http"
import { handler } from "./handler"

const PORT = 3030

const app = createServer(handler)
app.listen(PORT, () => console.log(`SERVER LISTENING ON PORT ${PORT}`))
