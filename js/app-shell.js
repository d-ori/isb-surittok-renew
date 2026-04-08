/**
 * 공통 앱 셸: 테마 복원, top/menu.html 단일 로드(경로 자동 계산), 기본 테마 토글.
 * jQuery 이후, common.js 이전에 포함하세요.
 */
(function () {
    var t = localStorage.getItem("theme") || "light";
    if (t === "dark") document.documentElement.setAttribute("data-theme", "dark");
})();

function getAppStaticRoot() {
    var scripts = document.getElementsByTagName("script");
    for (var i = scripts.length - 1; i >= 0; i--) {
        var src = scripts[i].src || "";
        if (src.indexOf("/js/app-shell.js") !== -1) {
            return src.replace(/\/js\/app-shell\.js(\?.*)?$/i, "");
        }
    }
    return "";
}

function resolveMenuTopBase() {
    var root = getAppStaticRoot();
    if (root) return root.replace(/\/$/, "");
    var path = window.location.pathname || "";
    var dir = path.replace(/\/[^/]*$/, "");
    var parts = dir.replace(/^\//, "").split("/").filter(Boolean);
    var depth = parts.length;
    return depth <= 0 ? "" : new Array(depth).fill("..").join("/");
}

window.toggleTheme =
    window.toggleTheme ||
    function () {
        var currentTheme = document.documentElement.getAttribute("data-theme");
        var newTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        window.dispatchEvent(
            new CustomEvent("themechange", { detail: { theme: newTheme } }),
        );
        var btn = document.querySelector(".theme-toggle-btn");
        if (btn) {
            btn.innerHTML =
                newTheme === "dark"
                    ? '<span id="theme-icon">☀️</span> Light Mode'
                    : '<span id="theme-icon">🌙</span> Dark Mode';
        }
        if (typeof window.__syncTopThemeControls === "function") {
            window.__syncTopThemeControls();
        }
    };

$(function () {
    var base = resolveMenuTopBase();
    var prefix = base ? base + "/" : "";
    var menuPath = prefix + "menu.html";
    var topPath = prefix + "top.html";

    $(".menu").each(function () {
        var $el = $(this);
        if (!$el.data("shellLoaded")) {
            $el.load(menuPath);
            $el.data("shellLoaded", true);
        }
    });
    $(".top").each(function () {
        var $el = $(this);
        if (!$el.data("shellLoaded")) {
            $el.load(topPath);
            $el.data("shellLoaded", true);
        }
    });

    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    var btn = document.querySelector(".theme-toggle-btn");
    if (btn && dark) {
        btn.innerHTML = '<span id="theme-icon">☀️</span> Light Mode';
    }
});
