require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');


const inputFile = path.join(__dirname, 'article.txt');
const outputFile = path.join(__dirname, 'artykul.html');


async function sendToOpenAI(articleContent) {
    const apiKey = process.env.OPENAI_API_KEY;
    const endpoint = "https://api.openai.com/v1/chat/completions";

    try {
        const response = await axios.post(
            endpoint,
            {
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are an assistant that generates HTML content with proper structure and placeholders for images.",
                    },
                    {
                        role: "user",
                        content: `Generate an HTML structure for the following article. Use appropriate HTML tags for content and placeholders for images with <img src="image_placeholder.jpg" alt="description">. Add captions under images using <figcaption>. No CSS or JavaScript code. The returned code should only contain the contents of the do entries between <body> and </body> tags. No <html> tags included, <head> nor <body>. The article content is:\n\n${articleContent}`,
                    },
                ],
                max_tokens: 1500,
            },
            {
                headers: {
                    "Authorization": `Bearer <API>`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error with OpenAI API:", error.response ? error.response.data : error.message);
        throw new Error("Failed to generate HTML from OpenAI.");
    }
}


async function main() {
    try {

        const articleContent = fs.readFileSync(inputFile, 'utf-8');

        console.log("Sending article content to OpenAI...");
        const generatedHtml = await sendToOpenAI(articleContent);


        fs.writeFileSync(outputFile, generatedHtml, 'utf-8');
        console.log(`Generated HTML saved to: ${outputFile}`);
    } catch (error) {
        console.error("Error:", error.message);
    }
}


main();
