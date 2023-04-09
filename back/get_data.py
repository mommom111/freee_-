from flask import Flask, request
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/users', methods=['POST'])
def add_user():
    data = request.get_json()
    if data and 'ID' in data and 'name' in data:
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute("INSERT INTO users (ID, name) VALUES (?, ?)", (data['ID'], data['name']))
        conn.commit()
        conn.close()
        print(data)
        return "User added successfully"
    else:
        return "Invalid data"

if __name__ == '__main__':
    app.run()