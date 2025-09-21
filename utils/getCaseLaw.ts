export async function getCaseLaw(topic: string, jurisdiction: string) {
  const response = await fetch("https://api.perplexity.ai/search", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: `recent case law in ${jurisdiction} about ${topic}`,
      include_sources: true
    })
  });

  const data = await response.json();
  return data.results.map(
    (result: { title: string; url: string }) => `• ${result.title} - ${result.url}`
  ).join("\n");
} 