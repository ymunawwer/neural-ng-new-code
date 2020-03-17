$(window).scroll(function() {
    var scroll = $(window).scrollTop();

    if (scroll >= 50) {
        $(".navbar.navbar-expand-lg").addClass("header-bg");
    } else {
        $(".navbar.navbar-expand-lg").removeClass("header-bg");
    }
});
