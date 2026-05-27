import json
import os

TODO_FILE = 'todo.json'

def read_todos():
    if not os.path.exists(TODO_FILE):
        return []
    with open(TODO_FILE, 'r') as f:
        data = json.load(f)
        return data.get('todos', [])

def write_todos(todos):
    with open(TODO_FILE, 'w') as f:
        json.dump({'todos': todos}, f, indent=2)