import React, { useState } from 'react';
import client from "../../client";
import {API_BASE_URL} from "../../config";


function LlamaChat() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleGenerate = async () => {
    try {
      const res = await client.post(API_BASE_URL + 'generate/', { prompt });
      setResponse(res.data.response);
    } catch (error) {
      console.error(error);
      setResponse('Something went wrong.');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>LLaMA Chat</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={5}
        style={{ width: '100%' }}
        placeholder="Ask something..."
      />
      <button onClick={handleGenerate} style={{ marginTop: '10px' }}>
        Generate
      </button>
      <div>
        <h3>Response:</h3>
        <p>{response}</p>
      </div>
    </div>
  );
}

export default LlamaChat;