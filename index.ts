import * as express from "express"
import * as body from "body-parser"
import Router from "./src/router"
import env from "./src/cli"

const app = express()

app.use(
	body.urlencoded({
		extended: false,
	}),
)

app.use(body.json())
app.use(Router)
app.listen(env.Port, () => console.log("server started at http://localhost:" + env.Port))

export default app
