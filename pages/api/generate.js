import {Configuration, OpenAIApi} from "openai";
import {JSDOM, VirtualConsole} from "jsdom";
import {Readability} from "@mozilla/readability";
import {NodeHtmlMarkdown} from "node-html-markdown";
// import {encode} from 'gpt-3-encoder'

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

export const config = {
    runtime: "edge",
};

const openai = new OpenAIApi(configuration);

export default async function (req, res) {
    if (!configuration.apiKey) {
        res.status(500).json({
            error: {
                message: "OpenAI API key not configured, please follow instructions in README.md",
            }
        });
        return;
    }

    const url = req.body.url || '';
    if (url.trim().length === 0) {
        res.status(400).json({
            error: {
                message: "Please enter a valid URL",
            }
        });
        return;
    }

    try {
        const {prompt, title} = await generateChatPrompt(url);
        const chatInput = {
            model: "gpt-3.5-turbo",
            messages: prompt,
            temperature: 0.4,
        };

        const completion = await openai.createChatCompletion(chatInput);
        const {prompt_tokens, completion_tokens, total_tokens} = completion.data.usage;
        res.status(200).json({
            result: completion.data.choices["0"].message.content,
            prompt_tokens: prompt_tokens,
            completion_tokens: completion_tokens,
            total_tokens: total_tokens,
            title: title,
        });
    } catch (error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: 'An error occurred during your request.',
                }
            });
        }
    }
}


async function generateChatPrompt(url) {
    const resp = await fetch(url);
    const text = await resp.text();

    const virtualConsole = new VirtualConsole();
    const doc = new JSDOM(text, {virtualConsole});

    const reader = new Readability(doc.window.document);
    const article = reader.parse();
    const contentMarkdown = NodeHtmlMarkdown.translate(article.content);

    const markdown = removeLinksFromMarkdown(contentMarkdown);

    const truncatedString = truncateStringToTokenCount(markdown, 3500);

    return {
        prompt: [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Can you help create a 250 word summary of the following article?"},
            {"role": "user", "content": "The article is formatted as markdown."},
            {"role": "user", "content": `The title of the article is ${article.title}.`},
            {"role": "user", "content": `The article is as follows: \n${truncatedString}`}
        ],
        title: `${article.title}`,
    };
}

// function that takes a string and truncates it to a word boundary of given word count
function truncateStringToTokenCount(str, num) {
    return str.split(/\s+/).slice(0, num).join(" ");
}

// function that removes links from markdown
function removeLinksFromMarkdown(text) {
    // Replace all link occurrences with the link text
    let regex = /\[([^\]]+)]\(([^)]+)\)/g;
    text = text.replace(regex, "$1");

    return text;
}