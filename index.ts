import * as express from "express"
import * as body from "body-parser"
import Router from "./src/router"

const { PORT = 3500 } = process.env

const app = express()

app.use(
	body.urlencoded({
		extended: false,
	}),
)

app.use(body.json())
app.use(Router)
app.listen(PORT, () => console.log("server started at http://localhost:" + PORT))

export default app
