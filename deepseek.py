from flask import Flask, render_template, request, jsonify, session
from datetime import datetime
import requests

app = Flask(__name__)

@app.route("/")
def index():
    # 首页，设置个访问障碍
    session.clear()
    return "<h1>阅读源代码，判断前两个路由和视图函数，确定访问URL，进入聊天</h1>"


@app.route("/chat", methods=["GET", "POST"])
def chat():    
    # 根据模版渲染聊天页面
    session.clear()
    return render_template('index.html')

app.secret_key = 'For flask session secret_key, random supported'
ARK_API_KEY = "YOUR API KEY"
API_URL = "https://ark.cn-beijing.volces.com/api/v3/chat/completions" # demo for volcengine.com

@app.route('/api/send', methods=['POST'])
def send_to_volcano():
    # 得到用户数据，向Deekseek发送数据
    init_conversation()
    data = request.json
    message = data.get('message', '')
    
    if not message:
        return jsonify({"error": "消息内容不能为空"}), 400
    # 添加到对话历史 (用户消息)
    user_msg = {
        "role": "user",
        "content": message,
        "time": datetime.now().strftime("%H:%M:%S")
    }
    session['conversation'].append(user_msg)
    while len(session['conversation']) > 10:
           session['conversation'].pop(0)
        
    headers = {
        "Authorization": f"Bearer {ARK_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "ep-20250327094950-2hfkn",
        "messages": [{"role": "system", "content": "你是人工智能助手."},
                     {"role": "user", "content": message}],
        "temperature": 0.7
    }
    response = requests.post(
        API_URL,
        headers=headers,
        json=payload
    )   
    
    if response.status_code == 200:
        reply = response.json()["choices"][0]["message"]["content"]
        ai_msg = {
            "role": "assistant",
            "content": reply,
            "time": datetime.now().strftime("%H:%M:%S")
        }
        session['conversation'].append(ai_msg)
        session.modified = True
        
        return jsonify({
            "response": reply,
            "conversation": session['conversation']
        })
    else:
        return jsonify({"error": response.text}), response.status_code


@app.route('/api/clear', methods=['POST'])
def clear_session():
    session.clear()
    return jsonify({"status": "success", "message": "Session cleared"})

# 初始化对话历史
def init_conversation():
    if 'conversation' not in session:
        session['conversation'] = []

if __name__ == "__main__":
    app.run(host="0.0.0.0", port="80", debug=True, use_reloader=False)