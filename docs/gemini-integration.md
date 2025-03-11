# Google Gemini AI Integration

This starter includes built-in integration with Google's Generative AI (Gemini) models, allowing you to easily add AI capabilities to your application.

## Setup

### 1. Get a Gemini API Key

Before using the Gemini AI features, you need to obtain an API key:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key for the next step

### 2. Set Up Environment Variables

Create a `.env` file at the root of your project (you can copy from `.env.example`):

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

This environment variable will be automatically loaded by Vite.

## Using the Gemini Utilities

### Basic Text Generation

Import the utility functions and generate text:

```tsx
import { generateText } from '../utils/gemini';

// In your component:
const handleGenerateText = async () => {
  try {
    const prompt = "Explain React hooks in simple terms";
    const response = await generateText(prompt);
    console.log(response);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### Vision Model (Image + Text)

For analyzing images and responding to prompts about them:

```tsx
import { generateTextFromImage } from '../utils/gemini';

// In your component:
const handleAnalyzeImage = async () => {
  // Convert an image to base64
  const fileInput = document.getElementById('imageInput') as HTMLInputElement;
  const file = fileInput.files?.[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onloadend = async () => {
    try {
      // Remove the prefix from the base64 string
      const base64Data = (reader.result as string).split(',')[1];
      const prompt = "Describe what you see in this image";
      const response = await generateTextFromImage(prompt, base64Data);
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  reader.readAsDataURL(file);
};
```

### Chat Sessions

For maintaining a conversation with memory of previous messages:

```tsx
import { createChatSession } from '../utils/gemini';

// In your component:
const startChat = async () => {
  try {
    const chat = createChatSession();
    
    // First message
    const response1 = await chat.sendMessage("Hello, how can you help me with my React project?");
    console.log(response1.text());
    
    // Follow-up (the chat remembers context)
    const response2 = await chat.sendMessage("What's a good state management approach?");
    console.log(response2.text());
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### Raw API Calls from JavaScript

In addition to the high-level utility functions, this starter includes a utility for making raw API calls directly to the Gemini API from your JavaScript code:

```tsx
import { rawGeminiApiCall } from '../utils/gemini';

// Example: Generate text with raw API call
const handleGenerateWithRawApi = async () => {
  try {
    const payload = {
      contents: [{
        parts: [{ text: "What is the meaning of life?" }]
      }]
    };
    
    const response = await rawGeminiApiCall('generateContent', 'gemini-pro', payload);
    
    // Process the raw response
    const generatedText = response.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log(generatedText);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

This gives you more flexibility and direct access to the API, which can be useful for:

- Accessing advanced features not yet exposed in the SDK
- Fine-tuning API requests with specific parameters
- Better understanding the underlying API structure
- Debugging API interactions

The starter includes a working example component in `src/components/GeminiRawApi.tsx` that demonstrates this approach, including displaying the full raw API response.

## Making Direct API Calls

While this starter provides a JavaScript SDK integration, you can also make direct REST API calls to Gemini. This can be useful when working with other programming languages or for debugging purposes.

### Basic Text Generation with cURL

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY" \
-H 'Content-Type: application/json' \
-X POST \
-d '{
  "contents": [{
    "parts":[{"text": "Explain how AI works"}]
    }]
   }'
```

### Chat API with cURL

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY" \
-H 'Content-Type: application/json' \
-X POST \
-d '{
  "contents": [
    {
      "role": "user",
      "parts":[{"text": "Hello, how are you?"}]
    },
    {
      "role": "model",
      "parts":[{"text": "I'\''m doing well, thank you for asking! How can I help you today?"}]
    },
    {
      "role": "user",
      "parts":[{"text": "Tell me about React"}]
    }
  ]
}'
```

### Image Analysis with cURL

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=YOUR_API_KEY" \
-H 'Content-Type: application/json' \
-X POST \
-d '{
  "contents": [{
    "parts":[
      {"text": "What'\''s in this image?"},
      {
        "inline_data": {
          "mime_type": "image/jpeg",
          "data": "BASE64_ENCODED_IMAGE_DATA"
        }
      }
    ]
  }]
}'
```

> **Note**: Replace `YOUR_API_KEY` with your actual Gemini API key, and for image analysis, replace `BASE64_ENCODED_IMAGE_DATA` with the base64-encoded image data.

## Ready-to-Use Components

This starter includes a sample chat component in `src/components/GeminiChat.tsx` that demonstrates a full implementation of a chat interface with Gemini AI.

You can use this component directly or as a reference for building your own AI-powered features.

## Best Practices

1. **API Key Security**:
   - Never commit your API keys to version control
   - Use environment variables for storing sensitive information
   - Consider implementing backend proxies for production applications

2. **Error Handling**:
   - Always use try/catch blocks when making API calls
   - Provide meaningful error messages to users
   - Implement retry logic for transient failures

3. **Rate Limiting**:
   - Be mindful of API rate limits
   - Implement debouncing for user-triggered requests
   - Consider caching responses when appropriate

4. **Prompt Engineering**:
   - Be specific in your prompts
   - Consider using system messages to set context
   - Test different approaches to get optimal results

## Customizing Gemini Settings

You can customize the behavior of Gemini models by modifying the configuration in `src/utils/gemini.ts`:

```ts
// Adjust temperature for more creative or deterministic responses
// Higher values (e.g., 0.9) = more creative
// Lower values (e.g., 0.1) = more deterministic
generationConfig: {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 2048,
},
```

## Further Resources

- [Google Generative AI Documentation](https://ai.google.dev/docs)
- [Gemini API Reference](https://ai.google.dev/api/rest/v1beta/models)
- [Prompt Engineering Guide](https://ai.google.dev/docs/prompting) 