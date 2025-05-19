import {z} from "zod"
import {FastestNodeClient, fetchBeacon, fetchBeaconByTime} from "drand-client"
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js"
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js"

const server = new McpServer({
    name: "drand",
    version: "0.0.1",
    capabilities: {
        resources: {},
        tools: {}
    }
})

const drandClient = new FastestNodeClient(["https://api.drand.sh/52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971", "https://api3.drand.sh/52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971", "https://api2.drand.sh/52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971"], {
    disableBeaconVerification: false,
    noCache: false,
    chainVerificationParams: {
        chainHash: "52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971",
        publicKey: "83cf0f2896adee7eb8b5f01fcad3912212c437e0073e911fb90022d3e760183c8c4b450b6a0a6c3ac6a5776a2d1064510d1fec758c921cc22b0e17e63aaf4bcb5ed66304de9cf809bd274ca73bab4af5a6e9c76a4bc09e76eae8991ef5ece45a"
    }
}, 5000)
drandClient.start()

server.tool(
    "get-randomness-latest",
    "Get the latest random value from drand quicknet",
    {},
    async ()  => {
        const response = await fetchBeaconByTime(drandClient, Date.now())
        return {
            content: [{
                type: "text",
                text: `0x${response.randomness}`
            }]
        }
    }
)

type RoundParams = {
    round: number
}
server.tool(
    "get-randomness-by-round",
    "Get the random value associated with a specfic round from drand quicknet",
    {round: z.number()},
    async ({round}: RoundParams) => {
        const response = await fetchBeacon(drandClient, round)
        return {
            content: [{
                type: "text",
                text: `0x${response.randomness}`
            }]
        }
    }
)

type TimeParams = {
    time: number
}
server.tool(
    "get-randomness-by-time",
    "Get the random value associated with a specific time from drand quicknet",
    {time: z.number()},
    async ({time}: TimeParams) => {
        const response = await fetchBeaconByTime(drandClient, time)
        return {
            content: [{
                type: "text",
                text: `0x${response.randomness}`
            }]
        }
    }
)

async function main() {
    const transport = new StdioServerTransport()
    await server.connect(transport)
}

main().catch(err => {
    console.error("fatal error running drand server", err)
    process.exit(1)
})