export async function callMcpTool(client: any, toolName: string, args: Record<string, unknown>) {
  if (!client) throw new Error("MCP client not initialized");
  if (!toolName) throw new Error("Missing tool name");
  if (!client.tools?.includes?.(toolName)) {
    throw new Error(`MCP tool not found: ${toolName}`);
  }
  if (!args || typeof args !== "object") {
    throw new Error("MCP call args must be an object");
  }

  try {
    const res = await client.callTool(toolName, args);
    if (!res) throw new Error("MCP returned empty response");
    if (res.error) throw new Error(`MCP tool error: ${res.error?.message || "unknown"}`);
    return res;
  } catch (err: any) {
    // Re-throw with a message guaranteed to be serializable
    const message = err?.message || "Unknown MCP client error";
    const cause = err?.stack || "";
    throw new Error(`${message}\n${cause}`);
  }
}
