#!/usr/bin/env node
// kard-mcp · MCP stdio server wrapping kard-sdk · MIT · AI-Native Solutions
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server({ name: 'kard-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });

const TOOLS = [
  {
    name: 'kard_load_cards',
    description: 'loadCards · from kard-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { loadCards } = await import('@ai-native-solutions/kard-sdk');
      return typeof loadCards === 'function' ? await loadCards(args) : { error: 'loadCards not callable' };
    }
  },
  {
    name: 'kard_go_view',
    description: 'goView · from kard-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { goView } = await import('@ai-native-solutions/kard-sdk');
      return typeof goView === 'function' ? await goView(args) : { error: 'goView not callable' };
    }
  },
  {
    name: 'kard_save',
    description: 'save · from kard-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { save } = await import('@ai-native-solutions/kard-sdk');
      return typeof save === 'function' ? await save(args) : { error: 'save not callable' };
    }
  },
  {
    name: 'kard_load',
    description: 'load · from kard-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { load } = await import('@ai-native-solutions/kard-sdk');
      return typeof load === 'function' ? await load(args) : { error: 'load not callable' };
    }
  },
  {
    name: 'kard_render_factions',
    description: 'renderFactions · from kard-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { renderFactions } = await import('@ai-native-solutions/kard-sdk');
      return typeof renderFactions === 'function' ? await renderFactions(args) : { error: 'renderFactions not callable' };
    }
  },
  {
    name: 'kard_card_el',
    description: 'cardEl · from kard-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { cardEl } = await import('@ai-native-solutions/kard-sdk');
      return typeof cardEl === 'function' ? await cardEl(args) : { error: 'cardEl not callable' };
    }
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ handler, ...rest }) => rest)
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const t = TOOLS.find(x => x.name === req.params.name);
  if (!t) throw new Error('unknown tool: ' + req.params.name);
  const result = await t.handler(req.params.arguments || {});
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

await server.connect(new StdioServerTransport());
console.error('kard-mcp v1.0.0 · stdio ready');
