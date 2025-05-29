# Bedrock Chatbot Frontend

A modern, responsive React chatbot interface with image upload, typewriter effect, and API integration.

## Requirements

- **Node.js** (v16 or newer recommended)
- **npm** (v8 or newer recommended)

## Installation & Build Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd bedrock-chat-kb-goda-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables (Optional)**
   - If you want to use environment variables for API endpoints, create a `.env` file in the project root:
     ```
     REACT_APP_API_BASE_URL=https://iimvj6vkh7.execute-api.us-west-2.amazonaws.com
     ```
   - Update the code to use `process.env.REACT_APP_API_BASE_URL` if needed.

4. **Build the project**
   ```bash
   npm run build
   ```
   - This will create a `build/` directory with static files ready for deployment.

5. **Serve the build (for production)**
   - You can use any static file server. For example, with [serve](https://www.npmjs.com/package/serve):
     ```bash
     npm install -g serve
     serve -s build
     ```
   - Or configure with Nginx, Apache, or your preferred web server.

## Development

To run the app in development mode (with hot reload):

```bash
npm start
```
- Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Responsive, modern chat UI
- Typewriter effect for bot answers
- Image upload with model selection and caption
- Table rendering and emotion analysis display
- Adjustable/resizable chat window
- Mobile-friendly design

## Customization

- **API Endpoints:** Update the endpoints in `src/components/ChatWindow.tsx` as needed.
- **Branding/Styling:** Edit the styled-components in the `src/components/` directory.

## Troubleshooting

- Make sure Node.js and npm are installed and up to date.
- If you change the API endpoint, restart the dev server.
- For CORS/API issues, ensure your backend allows requests from your frontend domain.
