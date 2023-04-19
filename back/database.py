import sqlite3

conn = sqlite3.connect("database.db")

cursor = conn.cursor()

cursor.execute("""
   CREATE TABLE users (
      id INTEGER PRIMARY KEY,
      name TEXT
   )
""")

conn.commit()

conn.close()

# # LINE Messaging APIでのイベントハンドリングの例
# from linebot.models import MessageEvent, TextMessage, TextSendMessage

# # イベントハンドラの定義
# @handler.add(MessageEvent, message=TextMessage)
# def handle_message(event):
#     user_id = event.source.user_id
#     message = event.message.text

#     if message == "出勤":
#         # 出勤ボタンが押された場合の処理を実装
#         # 従業員IDの取得やバックエンドへの送信などを行う
#         # 以下は例示的なコード
#         employee_id = get_employee_id(user_id)  # 従業員IDを取得する関数の例
#         if employee_id:
#             send_attendance_request(employee_id)  # バックエンドに出勤リクエストを送信する関数の例
#     elif message == "退勤":
#         # 退勤ボタンが押された場合の処理を実装
#         # 同様に従業員IDの取得やバックエンドへの送信などを行う
#         # 以下は例示的なコード
#         employee_id = get_employee_id(user_id)  # 従業員IDを取得する関数の例
#         if employee_id:
#             send_leaving_request(employee_id)  # バックエンドに退勤リクエストを送信する関数の例

# from flask import Flask, request
# from datetime import datetime

# app = Flask(__name__)

# @app.route('/attendance', methods=['POST'])
# def handle_attendance():
#     employee_id = request.form['employee_id']
#     # リクエストから従業員IDを取得

#     shift_info = get_shift_info(employee_id)  # 従業員のシフト情報を取得する関数の例
#     if shift_info:
#         # 現在の日付と時刻と照らし合わせて打刻処理を行う
#         # 以下は例示的なコード
#         current_time = datetime.now()  # 現在の日付と時刻を取得
#         attendance_time = current_time.time()  # 時刻のみを抽出

#         # シフト情報と勤務時間の照らし合わせ
#         for shift in shift_info:
#             start_time = shift['start_time']  # シフトの開始時刻を取得
#             end_time = shift['end_time']  # シフトの終了時刻を取得

#             # 打刻された時間が勤務時間の10分前以内であれば勤務開始
#             if start_time <= attendance_time <= start_time + timedelta(minutes=10):
#                 # 勤務開始の処理を実行
#                 # 以下は例示的なコード
#                 update_attendance_status(employee_id, "出勤")  # 打刻状態を更新する関数の例
#                 return "勤務が開始されました"
#             # 打刻された時間が勤務時間よりも前であればエラーを返す
#             elif attendance_time < start_time:
#                 return "今は出勤できません"
#             # 打刻された時間が勤務時間の10分前を超えていればエラーを返す
#             elif attendance_time > start_time + timedelta(minutes=10):
#                 return "今は出勤できません"

#     # シフト情報が存在しない場合はエラーを返す
#     return "シフト情報がありません"

# if __name__ == '__main__':
#     app.run(debug=True)