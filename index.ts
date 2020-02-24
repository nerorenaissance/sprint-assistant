import * as express from "express"
import * as body from "body-parser"
import Router from "./src/router"
import env from "./src/cli"

if (!env.botName) {
	throw new Error(`Env var BOT_NAME is required`)
}

if (!env.botURL) {
	throw new Error(`Env var BOT_URL is required`)
}

console.log(`MODE = ${env.mode}`)

export default express()
	.use(
		body.urlencoded({
			extended: false,
		}),
	)
	.use(body.json())
	.use(Router)
	.listen(env.Port, () => console.log("Server started at http://localhost:" + env.Port))
