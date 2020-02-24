import * as express from "express"
import * as body from "body-parser"
import Router from "./src/router"
import env from "./src/cli"

export default express()
	.use(
		body.urlencoded({
			extended: false,
		}),
	)
	.use(body.json())
	.use(Router)
	.listen(env.Port, () => console.log("server started at http://localhost:" + env.Port))
