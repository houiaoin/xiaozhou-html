from flask import Flask, render_template, request, jsonify, redirect, url_for
import json
import os
import time
from datetime import datetime

app = Flask(__name__, static_folder='static', template_folder='templates')

# 确保数据目录存在
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
MESSAGES_FILE = os.path.join(DATA_DIR, 'messages.json')

if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

if not os.path.exists(MESSAGES_FILE):
    with open(MESSAGES_FILE, 'w', encoding='utf-8') as f:
        json.dump([], f)

# 读取留言数据
def get_messages():
    try:
        with open(MESSAGES_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"读取留言失败: {e}")
        return []

# 保存留言数据
def save_message(message):
    try:
        messages = get_messages()
        messages.insert(0, message)  # 添加到开头
        with open(MESSAGES_FILE, 'w', encoding='utf-8') as f:
            json.dump(messages, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"保存留言失败: {e}")
        return False

# 主页
@app.route('/')
def index():
    return render_template('index.html')

# API：获取留言
@app.route('/api/messages', methods=['GET'])
def api_get_messages():
    return jsonify(get_messages())

# API：添加留言
@app.route('/api/messages', methods=['POST'])
def api_add_message():
    try:
        data = request.get_json()
        
        if not data or 'author' not in data or 'content' not in data or 'time' not in data:
            return jsonify({'error': '请提供完整的留言信息'}), 400
        
        new_message = {
            'id': str(int(time.time() * 1000)),
            'author': data['author'],
            'content': data['content'],
            'time': data['time']
        }
        
        if save_message(new_message):
            return jsonify(new_message), 201
        else:
            return jsonify({'error': '保存留言失败'}), 500
            
    except Exception as e:
        print(f"添加留言时发生错误: {e}")
        return jsonify({'error': '服务器错误'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
