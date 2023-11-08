let typed = new Typed(".auto-type", {
    strings: ["full stack web developer", "mern stack developer", "software engineer"],
    typeSpeed: 125,
    backSpeed: 100,
    loop: true
})

$('.navbar-nav > li > a').on('click', function() {
    $('.navbar-collapse').collapse('hide');
});