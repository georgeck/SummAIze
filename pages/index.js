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
            if (urlInput === "") {
                setResult("Please enter a valid URL to summarize");
                return;
            }
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
                // noinspection ExceptionCaughtLocallyJS
                throw new Error(`Request failed with status ${response.status}`);
            }
            setResult(data.result);
            setTitle(data.title);
            setPrompt_tokens(data.prompt_tokens);
            setCompletion_tokens(data.completion_tokens);
            setTotal_tokens(data.total_tokens);
            setUrlInput("");
        } catch (error) {
            console.error(error);
            setResult(`Error generating summary. Please try again.\n${error.message}`);
        } finally {
            // re-enable form button
            event.target[1].removeAttribute("disabled");
        }
    }

    return (
        <>
            <Head>
                <meta charSet="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <meta name="description" content="Summarize links using GPT3"/>
                <meta name="keywords" content="GPT3, OpenAI, Summarize, Summarization, AI, Machine Learning"/>
                <meta name="author" content="George Chiramattel"/>

                <title>SummAIze</title>
                <link rel="icon" href="/favicon-32x32.png"/>
            </Head>

            <main className={styles.main}>
                <img src="/Logo.png" className={styles.icon} alt={"SummAIze Logo"}/>
                <h3>Summarize links using GPT3</h3>
                <form onSubmit={onSubmit}>
                    <label htmlFor="urlID">Enter an URL to summarize 👇</label>
                    <input
                        type="text" name="url" id={"urlID"}
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
                    <textarea name="result" id="resultID" rows="25" aria-label="Article summary" disabled value={result}/>

                    <div>
                        {prompt_tokens > 0 && <span><b>Prompt tokens</b>: {prompt_tokens}</span>}
                        {completion_tokens > 0 && <span> |  <b>Completion tokens</b>: {completion_tokens}</span>}
                        {total_tokens > 0 && <span> | <b>Total tokens</b>: {total_tokens} |&nbsp;
                            <b>Total Cost:</b> ${((Number.parseInt(total_tokens) / 1000) * 0.002).toFixed(6)}</span>}
                    </div>
                </div>

                <footer className={styles.footer}><span>Made with ❤️ by&nbsp;<a href="https://george.chiramattel.com">George
                    Chiramattel</a>&nbsp;based on the&nbsp;<a
                    href="https://github.com/openai/openai-quickstart-node.git">Quick-Start guide</a>&nbsp;from&nbsp;
                    <a
                        href="https://platform.openai.com/docs/quickstart/setup">OpenAI</a>.<br/>
                    This code for this project is available at this &nbsp;<a
                        href="https://github.com/georgeck/gpt-summary" >Github repository</a>.

                </span>
                </footer>
            </main>
        </>
    );
}
