from flask import Flask, request
import sqlite3
from flask_cors import CORS
from flask import jsonify

app = Flask(__name__)
CORS(app)

@app.route('/api/users', methods=['POST'])
def add_user():
    data = request.get_json()
    if data is None or 'ID' not in data and 'name' not in data: # **IDの入力だけして設定ボタンを押すとそのままデータが挿入される。** あるいはバリデーションの使用
        return jsonify({'message': 'Invalid request data!'}), 400
    with sqlite3.connect('database.db') as conn:
        c = conn.cursor()
        # Check if user already exists
        c.execute("SELECT * FROM users WHERE ID=?", (data['ID'],))
        existing_user = c.fetchone()
        if existing_user:
            return jsonify({'message': 'User with that ID already exists!'}), 409
        # Add user to database
        c.execute("INSERT INTO users (ID, name) VALUES (?, ?)", (data['ID'], data['name']))
        conn.commit()
    return jsonify({'message': 'User added successfully!'}), 201
    
@app.route('/api/users', methods=['GET'])
def get_users():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM users")
    rows = c.fetchall()
    users = []
    for row in rows:
        user = {
            "id": row[0],
            "name": row[1]
        }
        users.append(user)
    conn.close()
    return jsonify(users)

@app.route('/api/employees', methods=['POST'])
def add_employee():
    data = request.get_json()
    if data is None or 'employee_id' not in data and 'name' not in data and 'phone' not in data:
        return jsonify({'message': 'Invalid request data!'}), 400
    with sqlite3.connect('mydb.db') as conn:
        c = conn.cursor()
        # Check if user already exists
        c.execute("SELECT * FROM employees WHERE employee_id=?", (data['employee_id'],))
        existing_user = c.fetchone()
        if existing_user:
            return jsonify({'message': 'User with that ID already exists!'}), 409
        # Add user to database
        c.execute("INSERT INTO employees (employee_id, name, phone) VALUES (?, ?, ?)", (data['employee_id'], data['name'], data['phone']))
        conn.commit()
    return jsonify({'message': 'User added successfully!'}), 201

@app.route('/api/employees', methods=['GET'])
def get_employees():
    conn = sqlite3.connect('mydb.db')
    c = conn.cursor()
    c.execute("SELECT * FROM employees")
    rows = c.fetchall()
    employees = []
    for row in rows:
        employee = {
            "id": row[0],
            "employee_id": row[1],
            "name": row[2],
            "phone": row[3]
        }
        employees.append(employee)
    conn.close()
    return jsonify(employees)

if __name__ == '__main__':
    app.run()