# main.py
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.langflow_runner import LangFlowRunner
from dotenv import load_dotenv
import os


# Get the path to the project root directory, which is the parent of the directory
# where this main.py file is located.
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
dotenv_path = os.path.join(project_root, '.env')


# Load environment variables from the .env file found in the project root.
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
    print(f"INFO: Successfully loaded environment variables from {dotenv_path}")
else:
    print(f"WARNING: .env file not found at {dotenv_path}")


# Initialize FastAPI application
app = FastAPI(title="LangFlow Multi-Agent Chat API")


# Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Define a Pydantic model for the chat request body
class ChatQuery(BaseModel):
    query: str
    # Add an optional conversation ID for maintaining chat history
    conversation_id: Optional[str] = None


# Initialize the LangFlowRunner once when the application starts
try:
    langflow_runner = LangFlowRunner()
except Exception as e:
    # If initialization fails (e.g., missing environment variables),
    # raise an error to prevent the app from starting.
    print(f"Failed to initialize LangFlowRunner: {e}")
    raise e


@app.post("/chat")
async def chat_endpoint(request_body: ChatQuery) -> Dict[str, Any]:
    """
    Handles chat requests by running a LangFlow flow with the user's query.
    """
    try:
        # Run the asynchronous flow with the user's query and conversation ID
        response_dict = await langflow_runner.run_flow(
            message=request_body.query,
            conversation_id=request_body.conversation_id
        )


        # The new LangFlowRunner returns a dictionary.
        # We extract the 'response' key to send back to the frontend.
        return {"message": response_dict.get("response")}


    except Exception as e:
        # Log the error and return a 500 Internal Server Error
        print(f"An unexpected error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Mount the static files (your React build)
# Make sure to build the React app first by running `npm run build` in the 'my-tailwind-app' directory.
# static_files_path = os.path.join(project_root, "my-tailwind-app/build")


# The "check_dir=False" is a workaround for development, allowing the server to start
# even if the 'build' directory doesn't exist yet.
# app.mount("/", StaticFiles(directory=static_files_path, html=True, check_dir=False), name="static")


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=5000, reload=True)

