# app/langflow_runner.py
import requests
import json
import uuid
from typing import Dict, Optional
import os


class LangFlowRunner:
    def __init__(self):
        self.base_url = os.getenv("LANGFLOW_HOST", "http://localhost:7860")
        self.flow_id = os.getenv("LANGFLOW_FLOW_ID")
        self.api_key = os.getenv("LANGFLOW_SECRET_KEY")


        if not self.api_key:
            raise Exception("LANGFLOW_API_KEY environment variable is required")
       
        # 🐛 This is the critical missing check
        if not self.flow_id:
            raise Exception("LANGFLOW_FLOW_ID environment variable is required")
       
    async def run_flow(self, message: str, conversation_id: Optional[str] = None) -> Dict:
        if not conversation_id:
            conversation_id = str(uuid.uuid4())
       
        # Use the EXACT format from LangFlow API
        payload = {
            "output_type": "chat",
            "input_type": "chat",
            "input_value": message
        }
       
        # Include the API key header
        headers = {
            "Content-Type": "application/json",
            "x-api-key": self.api_key
        }
       
        try:
            print(f"🔗 Calling: {self.base_url}/api/v1/run/{self.flow_id}")
            print(f"📦 Payload: {json.dumps(payload, indent=2)}")
           
            response = requests.post(
                f"{self.base_url}/api/v1/run/{self.flow_id}",
                json=payload,
                headers=headers,
                timeout=30
            )
           
            print(f"📡 Status: {response.status_code}")
           
            response.raise_for_status()
            result = response.json()
           
            # Debug: Print the raw response structure
            print(f"📄 Raw Response Keys: {list(result.keys())}")
           
            # Extract the clean response and determine agent type
            agent_response, agent_type = self._extract_best_response(result, message)
           
            print(f"✅ Response from {agent_type} agent: {agent_response[:100]}...")
           
            return {
                "response": agent_response,
                "agent_type": agent_type,
                "conversation_id": conversation_id,
                "confidence": "high"
            }
           
        except Exception as e:
            print(f"❌ LangFlow execution error: {str(e)}")
            raise Exception(f"LangFlow execution error: {str(e)}")


    def _extract_best_response(self, result: Dict, original_message: str) -> tuple[str, str]:
        """Extract the first valid chat response from the LangFlow result."""
        try:
            # Look for the chat output in the new, simpler structure
            if "outputs" in result and result["outputs"]:
                # The main output component is usually the first one
                main_output = result["outputs"][0]
               
                # Check within the 'outputs' of this component
                if "outputs" in main_output:
                    for output_component in main_output["outputs"]:
                        # The actual result is often in a 'results' dictionary
                        if "results" in output_component:
                            message_data = output_component.get("results", {}).get("message", {})
                            if "text" in message_data and message_data["text"].strip():
                                response_text = message_data["text"]
                                print(f"📝 Found response: {response_text[:100]}...")
                                return response_text, "chat"


            # Fallback for the original complex structure, just in case
            if "outputs" in result:
                for output in result["outputs"]:
                    if "results" in output and "message" in output["results"]:
                        message_data = output["results"]["message"]
                        if "text" in message_data and message_data["text"].strip():
                            response_text = message_data["text"]
                            print(f"📝 Found response (legacy path): {response_text[:100]}...")
                            return response_text, "chat"
           
            print("❌ No valid responses found in result")
            return "I apologise, but I couldn't process your request.", "general"
           
        except Exception as e:
            print(f"❌ Error extracting response: {e}")
            return "Error processing response", "general"



