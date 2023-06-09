
from flask import Flask, request, abort
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import MessageEvent, TextMessage, TextSendMessage, TemplateSendMessage, ButtonsTemplate, MessageAction
from datetime import datetime
import sqlite3
import config
import time

app = Flask(__name__)

app.config.from_object(config)

# Line Botのチャネルアクセストークンとチャネルシークレットを設定
# push時、環境変数に設定する
line_bot_api = LineBotApi('チャネルアクセストークン')
handler = WebhookHandler('チャネルシークレット')


@app.route("/callback", methods=['POST'])
def callback():
  # Webhookからのリクエストを取得
  signature = request.headers['X-Line-Signature']
  body = request.get_data(as_text=True)
  
  try:
    # リクエストの検証
    handler.handle(body, signature)
    events = handler.parse_events(body, signature)
    for event in events:
      if event.type == 'message':
        # メッセージイベントの場合
        handle_message(event)
      elif event.type == 'postback':
        # ポストバックイベントの場合
        handle_postback(event)
  except InvalidSignatureError:
        abort(400)

  return 'OK'

@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
  # メッセージの送信者のユーザーIDを取得
  user_id = event.source.user_id
  employee_id = event.message.text
  
  get_shift(user_id)
  
  conn = sqlite3.connect('mydb.db')
  c = conn.cursor()
  c.execute('SELECT * FROM users WHERE user_id = ?', (user_id,))
  user = c.fetchone()
  
  if user is not None:
    message = event.message.text
    if message == "出勤":
      # ユーザーの勤務予定を取得
      c.execute('SELECT * FROM shifts WHERE user_id = ?', (user_id,))
      shift = c.fetchone()
      print(shift)
      if shift is not None:
        # シフト情報を取得する
        id = shift[0]
        employee_id = shift[1]
        shift_date = datetime.datetime.strptime(shift[2], '%Y-%m-%d')
        shift_time = shift[3]
        # "morning" と "night" に応じて出勤時間を設定する
        if shift_time == "morning":
          start_time = datetime.datetime.combine(shift_date, datetime.time(hour=7, minute=50, second=0))
        elif shift_time == "night":
          start_time = datetime.datetime.combine(shift_date, datetime.time(hour=13, minute=50, second=0))
        else:
          start_time = None
          
        now = datetime.now()
        
        # 出勤時間の10分前であれば出勤時間を記録する
        if start_time < now:
          now = datetime.now()
          checked_in_time = now.strftime('%H:%M:%S')

          # データベースに出勤時間を追加する
          c.execute("UPDATE shifts SET checked_in_time = ? WHERE id = ?", (checked_in_time, id))
          conn.commit()
          
          reply_text = '出勤しました'
          line_bot_api.reply_message(
          event.reply_token,
          TextSendMessage(text=reply_text)
          )
        else:
          # 10分以上離れている場合はエラーメッセージ
          reply_text = "まだ勤務時間ではありません。"
          line_bot_api.reply_message(
          event.reply_token,
          TextSendMessage(text=reply_text)
          )
      else:
        # 勤務予定が存在しない場合はエラーメッセージ
        reply_text = "勤務予定が存在しません。"
        line_bot_api.reply_message(
        event.reply_token,
        TextSendMessage(text=reply_text)
        )
        
    # 退勤というメッセージが送られてきた場合
    elif message == "退勤":
      # ユーザーの勤務予定を取得
      c.execute('SELECT * FROM shifts WHERE user_id = ?', (user_id,))
      shift = c.fetchone()
      print(shift)
      if shift is not None:
        # シフト情報を取得する
        id = shift[0]
        employee_id = shift[1]
        shift_date = datetime.datetime.strptime(shift[2], '%Y-%m-%d')
        shift_time = shift[3]
        # "morning" と "night" に応じて出勤時間を設定する
        if shift_time == "morning":
          leaving_time = datetime.datetime.combine(shift_date, datetime.time(hour=13, minute=50, second=0))
        elif shift_time == "night":
          leaving_time = datetime.datetime.combine(shift_date, datetime.time(hour=17, minute=50, second=0))
        else:
          leaving_time = None
        now = datetime.now()
        
         # 退勤時間の10分前であれば退勤時間を記録する
        if leaving_time < now:
          now = datetime.now()
          leaving_time = now.strftime('%H:%M:%S')

          # データベースに退勤時間と時給を追加する
          c.execute('SELECT hourly_wage FROM employees WHERE id=?', (employee_id,))
          hourly_wage = c.fetchone()[0]
          c.execute("UPDATE shifts SET leaving_time = ?, hourly_wage = ? WHERE employee_id = ?", (leaving_time, hourly_wage, employee_id))
          conn.commit()
          
          reply_text = '退勤しました'
          line_bot_api.reply_message(
          event.reply_token,
          TextSendMessage(text=reply_text)
          )
        else:
          # 10分以上離れている場合はエラーメッセージ
          reply_text = "まだ退勤時間ではありません。"
          line_bot_api.reply_message(
          event.reply_token,
          TextSendMessage(text=reply_text)
          )
      else:
        # 勤務予定が存在しない場合はエラーメッセージ
        reply_text = "勤務予定が存在しません。"
        line_bot_api.reply_message(
        event.reply_token,
        TextSendMessage(text=reply_text)
        )
      
      # 出退勤以外のメッセージに対する処理
      reply_text = "エラーが発生しました。"
      line_bot_api.reply_message(
      event.reply_token,
      TextSendMessage(text=reply_text)
      )
  else:
    # ユーザーが存在しない場合
    c.execute("SELECT * FROM employees WHERE employee_id=?", (employee_id,))
    employee = c.fetchone()
    conn.close()
  
    # データベースを検索して従業員IDに対応する従業員情報を取得
    conn = sqlite3.connect('mydb.db')
    c = conn.cursor()
    c.execute("SELECT * FROM employees WHERE employee_id=?", (employee_id,))
    employee = c.fetchone()
    conn.close()
  
  if employee:
      # 従業員情報が存在する場合は、従業員の氏名を取得して返信
      employee_id = employee['employee_id']
      name = employee['name']
      reply_text = 'Employee ID: {}\nName: {}'.format(employee['employee_id'], employee['name'])
      buttons_template = ButtonsTemplate(
          title='従業員情報',
          text='Employee ID: {}\nName: {}'.format(employee_id, name),
          actions=[
              MessageAction(
                  label='はい',
                  text='はい'
              ),
              MessageAction(
                  label='いいえ',
                  text='いいえ'
              )
          ]
      )
      template_message = TemplateSendMessage(
          alt_text='従業員情報',
          template=buttons_template
      )
      line_bot_api.reply_message(
          event.reply_token,
          template_message
      )
  else:
      # 従業員情報が存在しない場合は、エラーメッセージを返信
      reply_text = '従業員IDが存在しません'
      line_bot_api.reply_message(
          event.reply_token,
          TextSendMessage(text=reply_text)
      )  
      
def get_current_time():
  now = datetime.now()
  get_shift(now)
  return now

# 次のシフトを取得する
def get_shift(user_id, now):
  conn = sqlite3.connect('mydb.db')
  c = conn.cursor()
  
  c.execute('SELECT * FROM shifts WHERE user_id = ? AND start_time > ? ORDER BY start_time LIMIT 1', (user_id, now))
  next_shift = c.fetchone()
  conn.close()
  remind_check_in_out(next_shift)
  
# 出退勤時間が過ぎても打刻がない場合は1分おきに通知する
def remind_check_in_out(user_id, now, next_shift):
  if next_shift is not None:
    work_day = datetime.strptime(next_shift[2], '%Y-%m-%d')
    
    #シフトタイプによって出勤時間を設定
    if next_shift[3] == 'morning':
      check_in_time = work_day.replace(hour=8, minute=0, second=0, microsecond=0)
      check_out_time = work_day.replace(hour=14, minute=0, second=0, microsecond=0)
    elif next_shift[3] == 'night':
      check_in_time = work_day.replace(hour=14, minute=0, second=0, microsecond=0)
      check_out_time = work_day.replace(hour=20, minute=0, second=0, microsecond=0)
      
    checked_in_time = next_shift[5]
    checked_out_time = next_shift[6]
    
    # 出勤時間が過ぎても打刻がない場合は1分おきに通知する
    while(check_in_time < now and checked_in_time is None):
      time.sleep(60)
      now = datetime.now()
      if now > check_in_time and checked_in_time is None:
        line_bot_api.push_message(user_id, TextSendMessage(text='出勤打刻を完了してください'))
        
    # 退勤時間が過ぎても打刻がない場合は1分おきに通知する
    while(check_out_time < now and checked_out_time is None):
      time.sleep(60)
      now = datetime.now()
      if now > check_out_time and checked_out_time is None:
        line_bot_api.push_message(user_id, TextSendMessage(text='退勤打刻を完了してください'))
    
    # 退勤打刻が行われた際に、次のシフト情報を取得する
    if checked_out_time is not None:
      get_shift(user_id, now)
      
        
def handle_postback(event):
  # ユーザーからのポストバックイベントを受信した場合の処理
  user_id = event.source.user_id
  payload = event.postback.data  # ポストバックデータを取得
  
  # ポストバックデータに従業員IDが含まれている場合は、ユーザーアカウントに従業員IDを追加
  if payload == 'はい':
      employee_id = payload.split('employee_id=')[1] # payloadから従業員IDを取得
      
      # ユーザーアカウントと従業員IDの紐付け情報をデータベースに保存
      conn = sqlite3.connect('mydb.db')
      c = conn.cursor()
      c.execute("INSERT INTO LINE_users (user_id, employee_id) VALUES (?, ?)", (user_id, employee_id))
      conn.commit()
      conn.close()
      # ユーザーに紐付け完了のメッセージを送信
      reply_text = '従業員IDとユーザーアカウントを紐付けました'
      line_bot_api.reply_message(
          event.reply_token,
          TextSendMessage(text=reply_text)
      )
  else:
      # 完了しなかった場合、エラーメッセージを返信
      reply_text = 'エラーが発生しました'
      line_bot_api.reply_message(
          event.reply_token,
          TextSendMessage(text=reply_text)
      )

if __name__ == "__main__":
    app.run()