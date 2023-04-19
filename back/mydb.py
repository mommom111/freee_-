import sqlite3

conn = sqlite3.connect("mydb.db")

cursor = conn.cursor()

cursor.execute("""
  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY,
    employee_id INTEGER NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL
  );
""")

cursor.execute("""
  CREATE TABLE IF NOT EXISTS shifts (
    id INTEGER PRIMARY KEY,
    employee_id INTEGER NOT NULL,
    shift_date DATE NOT NULL,
    shift_time TEXT CHECK(shift_time IN ('morning', 'night')) NOT NULL,
    user_id TEXT,
    FOREIGN KEY (employee_id) REFERENCES employees (id)
    FOREIGN KEY (user_id) REFERENCES LINE_users (user_id)
  );
""")

cursor.execute("""
  CREATE TABLE IF NOT EXISTS LINE_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    employee_id INTEGER
);
""")

conn.commit()

conn.close()