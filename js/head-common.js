(function () {
    function resolveAssetVersion() {
        var scriptSrc = "";
        var currentScript = document.currentScript;
        if (currentScript && currentScript.src) {
            scriptSrc = currentScript.src;
        } else {
            var scripts = document.getElementsByTagName("script");
            if (scripts.length > 0) {
                scriptSrc = scripts[scripts.length - 1].src || "";
            }
        }

        var query = scriptSrc.indexOf("?") > -1 ? scriptSrc.split("?")[1] : "";
        var fromScriptQuery = new URLSearchParams(query).get("ver");
        var fromWindow = window.__ASSET_VER__;
        var fromMeta = "";
        var versionMeta = document.querySelector('meta[name="asset-ver"]');
        if (versionMeta) {
            fromMeta = versionMeta.getAttribute("content");
        }

        return fromScriptQuery || fromWindow || fromMeta || "1";
    }

    function shouldLoadLegacyFormsCss() {
        // Default ON: legacy pages remain stable.
        // Disable explicitly only on pages fully migrated to modern styles:
        // 1) window.__DISABLE_LEGACY_FORMS_LISTS__ = true;
        // 2) <meta name="disable-legacy-forms-lists" content="true" />
        if (window.__DISABLE_LEGACY_FORMS_LISTS__ === true) return false;
        var legacyMeta = document.querySelector('meta[name="disable-legacy-forms-lists"]');
        if (!legacyMeta) return true;
        return (legacyMeta.getAttribute("content") || "").toLowerCase() !== "true";
    }

    var assetVer = resolveAssetVersion();
    var loadLegacyFormsCss = shouldLoadLegacyFormsCss();
    // Legacy pages run inline scripts right after </head>.
    // Keep dependency load order identical to static head markup.
    var tags = [
        '<meta charset="UTF-8" />',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
        '<title>A/S 이력관리시스템</title>',
        '<link rel="shortcut icon" href="../img/ico_shortIcon.png" />',
        '<script src="https://code.jquery.com/jquery-3.6.1.min.js" integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=" crossorigin="anonymous"><\/script>',
        '<script src="../js/axios.min.js"><\/script>',
        '<script src="../js/app-shell.js?ver=' + assetVer + '"><\/script>',
        '<script type="text/javascript" src="../js/common.js?ver=' + assetVer + '"><\/script>',
        // Apply persisted theme before CSS loads to prevent light/dark flash on navigation.
        "<script>const savedTheme = localStorage.getItem('theme') || 'light'; document.documentElement.setAttribute('data-theme', savedTheme);<\/script>",
        '<link rel="stylesheet" href="../css/modern.css?ver=' + assetVer + '" />',
        '<link rel="stylesheet" href="../css/modern-dashboard.css?ver=' + assetVer + '" />'
        // '<link rel="stylesheet" href="../css/common.css" />'
    ];

    if (loadLegacyFormsCss) {
        tags.push('<link rel="stylesheet" href="../css/legacy-forms-lists.css?ver=' + assetVer + '" />');
    }

    document.write(tags.join(''));
})();
