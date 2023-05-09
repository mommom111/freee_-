from flask import Flask, request
import sqlite3
from flask_cors import CORS
from flask import jsonify
import config
import datetime

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {"origins": ["http://localhost:3000"]},
    r"/freee_-/list": {"origins": ["http://localhost:3000"]},
    r"/freee_-/attendance": {"origins": ["http://localhost:3000"]}
})

app.config.from_object(config)

#従業員のデータを追加する
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

#従業員のデータを取得する
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

#勤務データを取得する
@app.route('/api/shifts/<int:employee_id>/', methods=['GET'])
def get_employee_calendar(employee_id):
    conn = sqlite3.connect('mydb.db')
    c = conn.cursor()
    c.execute("SELECT * FROM shifts WHERE employee_id=?", (employee_id,))
    shifts = c.fetchall()
    conn.close()
    return jsonify(shifts)

@app.route('/api/shifts/<int:employee_id>', methods=['POST'])
def handle_shift_submit():
    # リクエストからデータを取得する
    employee_id = request.form['employee_id']
    shift_date = request.form['shift_date']
    shift_time = request.form['shift_time']

    conn = sqlite3.connect('mydb.db')
    c = conn.cursor()

    # shiftsテーブルにデータを挿入する
    c.execute('INSERT INTO shifts (employee_id, shift_date, shift_time) VALUES (?, ?, ?)', (employee_id, shift_date, shift_time))
    conn.commit()
    conn.close()
    return 'Success'

@app.route('/api/salary', methods=['GET'])
def handle_salary():
    conn = sqlite3.connect('mydb.db')
    c = conn.cursor()
    c.execute('SELECT DISTINCT employee_id FROM shifts')
    employee_ids = c.fetchall()
    
    salaries = []
    
    for employee_id in employee_ids:
        c.execute('SELECT name FROM employees WHERE employee_id=?', (employee_id))
        employee_name = c.fetchone()[0]
        
        now = datetime.datetime.now()
        year_month = now.strftime('%Y-%m')
        # 月の勤務時間を取得する
        c.execute("SELECT SUM(working_hours) FROM shifts WHERE employee_id=? AND strftime('%Y-%m', shift_date)=?", (employee_id[0],year_month))
        total_working_hours = c.fetchone()[0]
        
        #月給の計算
        c.execute("SELECT * FROM shifts WHERE employee_id=? AND strftime('%Y-%m', shift_date)=?", (employee_id, year_month))
        shifts = c.fetchall()
        
        total_salary = 0
        for shift in shifts:
            hourly_wage = shift['hourly_wage']
            working_hours = shift['working_hours']
            one_time_salary = hourly_wage * working_hours
            total_salary += one_time_salary
        
        salary = {
            "employee_id": employee_id,
            "employee_name": employee_name,
            "total_working_hours": total_working_hours,
            "total_salary": total_salary
        }
        salaries.append(salary)

    conn.close()
    return jsonify(salaries)
        
@app.route('/api/hourly_wage/<int:employee_id>', methods=['POST'])
def handle_hourly_wage(employee_id):
    hourly_wage = request.form['hourly_wage']
    conn = sqlite3.connect('mydb.db')
    c = conn.cursor()
    c.execute('UPDATE employees SET hourly_wage=? WHERE employee_id=?', (hourly_wage, employee_id))
    conn.commit()
    conn.close()
    return 'Success'


if __name__ == '__main__':
    app.run(port=8888)