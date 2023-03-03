import Head from "next/head";
import {useState} from "react";
import styles from "./index.module.css";

export default function Home() {
    const [urlInput, setUrlInput] = useState("");
    const [result, setResult] = useState("");

    async function onSubmit(event) {
        event.preventDefault();
        try {
            // disable form button to prevent multiple requests
            event.target[1].setAttribute("disabled", "");
            setResult("Generating...");
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
                        placeholder="Enter a url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                    />
                    <input type="submit" value="Generate Summary"/>
                </form>

                <div className={styles.result}>
                    {result.length > 0 &&
                        <h4>Summary:</h4>
                    }
                    {result}
                </div>
            </main>
        </div>
    );
}
