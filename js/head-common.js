(function () {
    // Legacy pages run inline scripts right after </head>.
    // Keep dependency load order identical to static head markup.
    var tags = [
        '<meta charset="UTF-8" />',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
        '<title>A/S 이력관리시스템</title>',
        '<link rel="shortcut icon" href="../img/ico_shortIcon.png" />',
        '<script src="https://code.jquery.com/jquery-3.6.1.min.js" integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=" crossorigin="anonymous"><\/script>',
        '<script src="../js/axios.min.js"><\/script>',
        '<script src="../js/app-shell.js?ver=1"><\/script>',
        '<script type="text/javascript" src="../js/common.js?ver=1"><\/script>',
        '<link rel="stylesheet" href="../css/modern.css" />',
        '<link rel="stylesheet" href="../css/modern-dashboard.css" />',
        "<script>const savedTheme = localStorage.getItem('theme') || 'light'; if (savedTheme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');<\/script>",
        // '<link rel="stylesheet" href="../css/common.css" />',
        '<link rel="stylesheet" href="../css/legacy-forms-lists.css" />'
    ];

    document.write(tags.join(''));
})();
