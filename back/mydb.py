import sqlite3

conn = sqlite3.connect("mydb.db")

cursor = conn.cursor()

cursor.execute("""
  CREATE TABLE employees (
    id INTEGER PRIMARY KEY,
    employee_id INTEGER NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL
  );
""")

cursor.execute("""
  CREATE TABLE shifts (
    id INTEGER PRIMARY KEY,
    employee_id INTEGER NOT NULL,
    shift_date DATE NOT NULL,
    shift_time TEXT CHECK(shift_time IN ('morning', 'night')) NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees (id)
  );
""")

conn.commit()

conn.close()