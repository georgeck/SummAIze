import Head from "next/head";
import {useState} from "react";
import styles from "./index.module.css";

export default function Home() {
    const [urlInput, setUrlInput] = useState("");
    const [result, setResult] = useState("");
    const [title, setTitle] = useState("");
    const [prompt_tokens, setPrompt_tokens] = useState("");
    const [completion_tokens, setCompletion_tokens] = useState("");
    const [total_tokens, setTotal_tokens] = useState("");

    function resetState() {
        setTitle("");
        setPrompt_tokens("");
        setCompletion_tokens("");
        setTotal_tokens("");
    }

    async function onSubmit(event) {
        event.preventDefault();
        try {
            // disable form button to prevent multiple requests
            event.target[1].setAttribute("disabled", "");
            setResult("Generating...");
            //reset the result
            resetState();

            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({url: urlInput}),
            });

            const data = await response.json();
            if (response.status !== 200) {
                throw data.error || new Error(`Request failed with status ${response.status}`);
            }
            setResult(data.result);
            setTitle(data.title);
            setPrompt_tokens(data.prompt_tokens);
            setCompletion_tokens(data.completion_tokens);
            setTotal_tokens(data.total_tokens);
            setUrlInput("");
            // Calculate total cost as total_tokens / 1000 * 0.002 (2 cents per token)  and round to nearest cent
        } catch (error) {
            // Consider implementing your own error handling logic here
            console.error(error);
            alert(error.message);
            setResult("Error generating summary. Please try again.");
        } finally {
            // re-enable form button
            event.target[1].removeAttribute("disabled");
        }
    }

    return (
        <div>
            <Head>
                <title>OpenAI Summarize URL</title>
                <link rel="icon" href="/dog.png"/>
            </Head>

            <main className={styles.main}>
                <img src="/openai.png" className={styles.icon} alt={"OpenAI Logo"}/>
                <h3>Enter an URL to summarize</h3>
                <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        name="url"
                        placeholder="Enter the url of the article to summarize"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                    />
                    <input type="submit" value="Generate a short Summary of the 👆 URL"/>
                </form>

                <div className={styles.result}>
                    {result.length > 0 &&
                        <h4>Article Summary:</h4>
                    }
                    {title.length > 0 && <h5>Title: {title}</h5>}
                    {result}
                    <p>
                    {prompt_tokens > 0 && <span><b>Prompt tokens</b>: {prompt_tokens}</span>}
                    {completion_tokens > 0 && <span><b>&nbsp; Completion tokens</b>: {completion_tokens}</span>}
                    {total_tokens > 0 &&  <span><b>&nbsp; Total tokens</b>: {total_tokens};&nbsp; <b>Total Cost:</b> ${(Number.parseInt(total_tokens)  / 1000) * 0.002}</span>}
                    </p>

                </div>
            </main>
        </div>
    );
}
