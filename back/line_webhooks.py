from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# LineからのWebhookを受け取り、データを返す
@app.route('/api/login', methods=['POST'])
def handle_line_webhook():
  # lineからのリクエストを取得する
  data = request.get_json()
  # リクエストからデータを取得する
  employee_id = data['employee_id']
  # データベースからデータを取得する
  conn = sqlite3.connect('mydb.db')
  c = conn.cursor()
  c.execute("SELECT * FROM employees WHERE employee_id=?", (employee_id,))
  employee = c.fetchone()
  conn.close()  
  # データを返す
  return jsonify(employee)