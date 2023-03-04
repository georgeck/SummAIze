import Head from "next/head";
import {useState} from "react";
import styles from "./index.module.css";

export default function Home() {
    const [urlInput, setUrlInput] = useState("");
    const [result, setResult] = useState("Article will be summarized here...");
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
                <title>SummAIze</title>
                <link rel="icon" href="/favicon-32x32.png"/>
            </Head>

            <main className={styles.main}>
                <img src="/Logo.png" className={styles.icon} alt={"SummAIze Logo"}/>
                <h3>Enter an URL to summarize</h3>
                <form onSubmit={onSubmit}>
                    <input
                        type="text" name="url"
                        placeholder="Url to summarize [e.g. https://george.chiramattel.com/blog/application-rewrite]"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                    />
                    <input type="submit" value="Generate a short Summary of the 👆 URL"/>
                </form>

                <div className={styles.result}>
                    {completion_tokens > 0 &&
                        <label htmlFor="resultID"><b>Article Title:</b> {title}<br/><b>Article Summary</b> 👇</label>
                    }
                    <textarea name="result" id="resultID" rows="25" disabled value={result}/>

                    <div>
                        {prompt_tokens > 0 && <span><b>Prompt tokens</b>: {prompt_tokens}</span>}
                        {completion_tokens > 0 && <span> |  <b>Completion tokens</b>: {completion_tokens}</span>}
                        {total_tokens > 0 && <span> | <b>Total tokens</b>: {total_tokens} |&nbsp;
                            <b>Total Cost:</b> ${((Number.parseInt(total_tokens) / 1000) * 0.002).toFixed(6)}</span>}
                    </div>
                </div>
            </main>
        </div>
    );
}
