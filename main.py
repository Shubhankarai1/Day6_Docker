# main.py

from fastapi import FastAPI # Import the FastAPI class

# Create an instance of the FastAPI application
app = FastAPI()

# Define a root endpoint (GET request to '/')
# This is a decorator that associates the function below with the '/' path
@app.get("/")
async def read_root():
    """
    This function handles GET requests to the root URL and returns a JSON response.
    """
    return {"message": "Hello World"}

# You can define another endpoint, for example, to greet a specific name
@app.get("/items/{item_id}")
async def read_item(item_id: int, query_param: str = None):
    """
    This function handles GET requests to '/items/{item_id}'.
    - item_id is a path parameter (integer).
    - query_param is an optional query parameter (string).
    """
    if query_param:
        return {"item_id": item_id, "query_param": query_param, "message": f"Hello item {item_id} with query {query_param}"}
    return {"item_id": item_id, "message": f"Hello item {item_id}"}

# To run this application:
# 1. Save this code as main.py
# 2. Open your terminal or command prompt.
# 3. Navigate to the directory where you saved main.py.
# 4. Install FastAPI and Uvicorn: pip install "fastapi[all]" uvicorn
# 5. Run the application: uvicorn main:app --reload
#    - 'main' refers to the main.py file.
#    - 'app' refers to the 'app' object created in main.py.
#    - '--reload' makes the server restart on code changes.
# 6. Open your web browser and go to http://127.0.0.1:8000/
# 7. To see the interactive API documentation, go to http://127.0.0.1:8000/docs
