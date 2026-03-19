// src/submit.js
export async function submitPipeline(nodes, edges) {
  try {
    const response = await fetch('http://localhost:8000/pipelines/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodes, edges }),
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    const result = await response.json();
    return result; // { num_nodes, num_edges, is_dag }
  } catch (err) {
    throw err;
  }
}
