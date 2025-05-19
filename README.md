# drand-mcp-server 🎲

Use verifiable randomness in your AI application. This [MCP](https://modelcontextprotocol.io) server enables you to get a random value from the [drand](https://drand.love) network, verify its validity and use it as an input seed to your model-driven flows!

## Development
- install dependencies with `npm install`
- build the application with `npm run build`
- run the application with either `npm start` or `node ./dist/index.mjs`

## Roadmap
- [x] fetch latest randomness
- [x] fetch randomness by round
- [x] fetch randomness by time
- [ ] select items from a list