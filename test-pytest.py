import pytest, requests

def test_get_book_by_id():
    url = "http://127.0.0.1:8087/tasks"  # Replace with your mock API URL
    response = requests.get(url)

    # Verify status code
    assert response.status_code == 200 

    # Verify content-type
    assert response.headers["Content-Type"] == "application/json"

    # Verify response structure (Assuming a book object with 'id', 'title', and 'completed')
    data = response.json()  
    assert isinstance(data, list)
    assert "id" in data[0]
    assert "title" in data[0]
    assert "completed" in data[0]


def test_create_book():
    url = "http://127.0.0.1:8087/tasks"  # Replace with your mock API URL
    data_post = {"title": "Buy me a coffee_decofenat", "completed": False}
    response = requests.post(url, json=data_post)

    assert response.status_code == 201
    assert response.headers["Content-Type"] == "application/json"

    # Check if the task was created (specifics depend on your mock API's response)
    data = response.json()
    assert data == "Task created"
    
"""
# test_api.py
import pytest
import requests

BASE_URL = "http://localhost:8087"

@pytest.fixture
def api():
    return BASE_URL

def test_create_task(api):
    # Test POST /tasks
    payload = {"title": "Test Task", "completed": False}
    response = requests.post(f"{api}/tasks", json=payload)
    assert response.status_code == 201
    assert response.json() == {"message": "Task created"}

def test_get_tasks(api):
    # Test GET /tasks
    response = requests.get(f"{api}/tasks")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_task(api):
    # Create a task first
    payload = {"title": "Task to Update", "completed": False}
    create_response = requests.post(f"{api}/tasks", json=payload)
    task_id = requests.get(f"{api}/tasks").json()[0]["id"]
    
    # Test PUT /tasks/:id
    update_payload = {"title": "Updated Task", "completed": True}
    response = requests.put(f"{api}/tasks/{task_id}", json=update_payload)
    assert response.status_code == 200
    assert response.json() == {"message": "Task updated"}

def test_delete_task(api):
    # Create a task first
    payload = {"title": "Task to Delete", "completed": False}
    create_response = requests.post(f"{api}/tasks", json=payload)
    task_id = requests.get(f"{api}/tasks").json()[0]["id"]
    
    # Test DELETE /tasks/:id
    response = requests.delete(f"{api}/tasks/{task_id}")
    assert response.status_code == 200
    assert response.json() == {"message": "Task deleted"}
"""