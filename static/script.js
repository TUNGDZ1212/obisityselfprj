document.addEventListener("DOMContentLoaded", () => {
    // Translations dictionary
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
            stat_running: "Trạng thái: Đang hoạt động raid!",
            set_title: "Cài Đặt Hệ Thống",
            set_desc: "Tùy chỉnh độ trễ, ngôn ngữ và tính năng lưu trữ tự động~",
            lbl_lang: "Ngôn Ngữ / Language:",
            lbl_speed_mode: "Chế Độ Tốc Độ:",
            opt_speed_safe: "An Toàn (Raid chậm, chống ban)",
            opt_speed_fast: "Nhanh (Raid 5s, nghỉ 2s)",
            opt_speed_custom: "Tùy Chỉnh (Custom Delay)",
            lbl_raid_delay: "Raid Delay (Giây gửi):",
            lbl_rest_delay: "Rest Delay (Giây nghỉ):",
            lbl_autosave: "Tự động lưu cài đặt (Autosave Setting cho IP này)",
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
            stat_running: "Status: Raid Active!",
            set_title: "System Settings",
            set_desc: "Customize delays, language and autosave settings~",
            lbl_lang: "Language / Ngôn Ngữ:",
            lbl_speed_mode: "Speed Mode:",
            opt_speed_safe: "Safe (Slow raid, anti-ban)",
            opt_speed_fast: "Fast (Raid 5s, rest 2s)",
            opt_speed_custom: "Custom (Custom Delay)",
            lbl_raid_delay: "Raid Delay (Send Seconds):",
            lbl_rest_delay: "Rest Delay (Rest Seconds):",
            lbl_autosave: "Autosave settings for this IP",
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

    // Hàm hiển thị thông báo trượt từ trên xuống mượt mà với emoji mặt cười
    function showKawaiiToast(message) {
        const toast = document.getElementById("kawaii-toast");
        const msgEl = document.getElementById("toast-message");
        msgEl.innerText = message;
        
        toast.classList.add("show");
        
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }

    // Intro Overlay handling
    const introOverlay = document.getElementById("intro-overlay");
    document.getElementById("enter-btn").addEventListener("click", () => {
        introOverlay.classList.add("hidden");
    });

    // Tabs Navigation
    const navItems = document.querySelectorAll(".nav-item");
    const tabPanes = document.querySelectorAll(".tab-pane");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            navItems.forEach(nav => nav.classList.remove("active"));
            tabPanes.forEach(pane => pane.classList.remove("active"));

            item.classList.add("active");
            const targetTab = document.getElementById(item.getAttribute("data-tab"));
            if (targetTab) targetTab.classList.add("active");
        });
    });

    // Ping type selector logic
    const pingTypeSelect = document.getElementById("ping-type");
    const pingIdGroup = document.getElementById("ping-id-group");
    pingTypeSelect.addEventListener("change", () => {
        if (pingTypeSelect.value === "user") {
            pingIdGroup.style.display = "flex";
        } else {
            pingIdGroup.style.display = "none";
        }
    });

    // Speed mode preset handling
    const speedModeSelect = document.getElementById("speed-mode");
    const raidDelayInput = document.getElementById("raid-delay-input");
    const restDelayInput = document.getElementById("rest-delay-input");

    speedModeSelect.addEventListener("change", () => {
        if (speedModeSelect.value === "fast") {
            raidDelayInput.value = 5;
            restDelayInput.value = 2;
        } else if (speedModeSelect.value === "safe") {
            raidDelayInput.value = 10;
            restDelayInput.value = 5;
        }
    });

    // Load initial settings from server
    fetch("/api/settings")
        .then(res => res.json())
        .then(data => {
            if (data.language) {
                document.getElementById("lang-select").value = data.language;
                applyLanguage(data.language);
            }
            if (data.speed_mode) document.getElementById("speed-mode").value = data.speed_mode;
            if (data.raid_delay) raidDelayInput.value = data.raid_delay;
            if (data.rest_delay) restDelayInput.value = data.rest_delay;
            if (data.autosave !== undefined) document.getElementById("autosave-check").checked = data.autosave;
        });

    // Save settings button
    document.getElementById("save-settings-btn").addEventListener("click", () => {
        const payload = {
            language: document.getElementById("lang-select").value,
            speed_mode: speedModeSelect.value,
            raid_delay: parseFloat(raidDelayInput.value),
            rest_delay: parseFloat(restDelayInput.value),
            autosave: document.getElementById("autosave-check").checked
        };
        fetch("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            applyLanguage(payload.language);
            showKawaiiToast(payload.language === "vi" ? "Đã lưu cài đặt thành công! 😊" : "Settings saved successfully! 😊");
        });
    });

    // Reset settings button
    document.getElementById("reset-settings-btn").addEventListener("click", () => {
        fetch("/api/settings/reset", { method: "POST" })
            .then(res => res.json())
            .then(data => {
                const s = data.settings;
                document.getElementById("lang-select").value = s.language;
                speedModeSelect.value = s.speed_mode;
                raidDelayInput.value = s.raid_delay;
                restDelayInput.value = s.rest_delay;
                document.getElementById("autosave-check").checked = s.autosave;
                applyLanguage(s.language);
                showKawaiiToast(s.language === "vi" ? "Đã khôi phục cài đặt gốc! 😄" : "Settings reset to default! 😄");
            });
    });

    // Language change live trigger
    document.getElementById("lang-select").addEventListener("change", (e) => {
        applyLanguage(e.target.value);
    });

    // Start / Stop Raid logic
    const startBtn = document.getElementById("start-btn");
    const stopBtn = document.getElementById("stop-btn");
    const statusDot = document.getElementById("status-dot");
    const statusText = document.getElementById("status-text");
    const liveDot = document.getElementById("live-dot");
    const liveStatusText = document.getElementById("live-status-text");
    const logBox = document.getElementById("log-box");

    startBtn.addEventListener("click", () => {
        const token = document.getElementById("user-token").value.trim();
        if (!token) {
            showKawaiiToast(currentLang === "vi" ? "Vui lòng nhập user token!" : "Please enter your user token!");
            return;
        }

        const payload = {
            token: token,
            target_type: document.getElementById("target-type").value,
            target_id: document.getElementById("target-id").value.trim(),
            message: document.getElementById("raid-message").value,
            ping_type: pingTypeSelect.value,
            ping_id: document.getElementById("ping-user-id").value.trim(),
            duration: document.getElementById("duration-input").value,
            limit: document.getElementById("limit-input").value,
            unlimited: document.getElementById("unlimited-check").checked,
            raid_delay: raidDelayInput.value,
            rest_delay: restDelayInput.value
        };

        fetch("/api/raid/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "error") {
                showKawaiiToast(data.message);
            } else {
                startBtn.disabled = true;
                stopBtn.disabled = false;
                statusDot.className = "dot online";
                statusText.innerText = "Running";
                liveDot.className = "dot online";
                liveStatusText.innerText = currentLang === "vi" ? "Trạng thái: Đang hoạt động raid!" : "Status: Raid Active!";
            }
        });
    });

    stopBtn.addEventListener("click", () => {
        fetch("/api/raid/stop", { method: "POST" })
            .then(res => res.json())
            .then(() => {
                startBtn.disabled = false;
                stopBtn.disabled = true;
                statusDot.className = "dot offline";
                statusText.innerText = "Ready";
                liveDot.className = "dot offline";
                liveStatusText.innerText = currentLang === "vi" ? "Trạng thái: Đang nghỉ ngơi" : "Status: Idle / Resting";
            });
    });

    // Poll status and logs periodically
    setInterval(() => {
        fetch("/api/status")
            .then(res => res.json())
            .then(data => {
                if (data.logs && data.logs.length > 0) {
                    logBox.innerHTML = data.logs.map(l => `<div class="log-line">${l}</div>`).join("");
                    logBox.scrollTop = logBox.scrollHeight;
                }
                if (!data.running && !startBtn.disabled) {
                    // Sync UI if stopped externally
                    stopBtn.disabled = true;
                    startBtn.disabled = false;
                    statusDot.className = "dot offline";
                    statusText.innerText = "Ready";
                    liveDot.className = "dot offline";
                    liveStatusText.innerText = currentLang === "vi" ? "Trạng thái: Đang nghỉ ngơi" : "Status: Idle / Resting";
                }
            });
    }, 1500);
});