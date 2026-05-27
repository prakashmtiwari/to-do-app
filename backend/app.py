from flask import Flask, request, jsonify
from todo import write_todos, read_todos

app = Flask(__name__)

@app.route('/todos', methods=['POST'])
def create_todo():
    todo = request.get_json()
    todos = read_todos()

    todos.append(todo)

    write_todos(todos)

    return jsonify(todo), 201

@app.route('/todos', methods=['GET'])
def get_todos():
    return jsonify(read_todos()), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)