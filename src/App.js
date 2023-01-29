/*global chrome*/
import React from "react";
import { useEffect, useState } from "react";
import "./App.css";
import { Configuration, OpenAIApi } from "openai";


function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const configuration = new Configuration({
    apiKey: "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",
  });

  const openai = new OpenAIApi(configuration);
  
  useEffect(() => {
    try {
      chrome.storage.local.get(null, function (data) {
        if ("prompt" in data) {
          setPrompt(data.prompt);
        }
      });
    } catch (e) {
      console.log("Error due to local state");
    }
  }, []);

  async function handleSubmit() {
    setIsLoading(true);

    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: prompt,
        max_tokens: 100,
      });
      setResponse(completion.data.choices[0].text);
      setIsLoading(false);
    } catch (e) {
      alert("Error: ", e);
      setIsLoading(false);
    }
  }

  return (
    <div className="App">
      <div className="input-group">
        <label className="asklabel" htmlFor="name">Write your query:</label><br></br>
        <input type="text" id="ask" multiline
              rows={4}
              margin="normal"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                chrome.storage.local.set({ prompt: e.target.value });
              }} /><br></br>
        <button className="submit"
        onClick={() => handleSubmit()}>Submit
        </button>
        <p className="answer">{response}</p>
      </div>
    </div>
  );
}

export default App;