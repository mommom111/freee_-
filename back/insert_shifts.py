import sqlite3

# データベースに接続する
conn = sqlite3.connect('mydb.db')

# カーソルを取得する
c = conn.cursor()

# shifts テーブルにデータを挿入する
c.execute("INSERT INTO shifts (employee_id, shift_date, shift_time) VALUES (?, ?, ?)", (1, "2023-04-01", "morning"))
c.execute("INSERT INTO shifts (employee_id, shift_date, shift_time) VALUES (?, ?, ?)", (1, "2023-04-05", "night"))
c.execute("INSERT INTO shifts (employee_id, shift_date, shift_time) VALUES (?, ?, ?)", (1, "2023-04-08", "night"))
c.execute("INSERT INTO shifts (employee_id, shift_date, shift_time) VALUES (?, ?, ?)", (1, "2023-04-11", "morning"))
c.execute("INSERT INTO shifts (employee_id, shift_date, shift_time) VALUES (?, ?, ?)", (2, "2023-04-02", "night"))
c.execute("INSERT INTO shifts (employee_id, shift_date, shift_time) VALUES (?, ?, ?)", (2, "2023-04-03", "morning"))
c.execute("INSERT INTO shifts (employee_id, shift_date, shift_time) VALUES (?, ?, ?)", (2, "2023-04-06", "night"))

# 変更を保存する
conn.commit()

# データベースとの接続を閉じる
conn.close()