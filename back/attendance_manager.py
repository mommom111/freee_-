
from flask import Flask, request, abort
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import MessageEvent, TextMessage, TextSendMessage, TemplateSendMessage, ButtonsTemplate, MessageAction
import sqlite3

app = Flask(__name__)

# Line Botのチャネルアクセストークンとチャネルシークレットを設定
# push時、環境変数に設定する
line_bot_api = LineBotApi('YK7yPyN4eJXc4XGdJJ/yCXQJ+dIJrSf6jlF1axLbITkXG6Vbrb8Zksb6WUi6fZeuPL3CsfId2Dz1BpgzxEqS/6C/QvQvPbuNojKVsV5qTbymgakimN+DPBXyBwpsJfiaM35QLE5KPaTI/1phWfTzzwdB04t89/1O/w1cDnyilFU=')
handler = WebhookHandler('3abf04bcf46730e7bcb665ba2aaf4bb4')

@app.route("/callback", methods=['POST'])
def callback():
    # Webhookからのリクエストを取得
    signature = request.headers['X-Line-Signature']
    body = request.get_data(as_text=True)
    
    try:
        # リクエストの検証
        handler.handle(body, signature)
    except InvalidSignatureError:
        abort(400)

    return 'OK'

@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    # ユーザーからのテキストメッセージを受信した場合の処理
    employee_id = event.message.text
    
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
        
def handle_postback(event):
    # ユーザーからのポストバックイベントを受信した場合の処理
    user_id = event.source.user_id
    payload = event.postback.data  # ポストバックデータを取得
    
    # ポストバックデータに従業員IDが含まれている場合は、ユーザーアカウントに従業員IDを追加
    if payload == 'はい':
        employee_id = event.message.text  # 従業員IDを取得


if __name__ == "__main__":
    app.run()