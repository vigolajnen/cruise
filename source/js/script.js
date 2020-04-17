'use strict';

(function() {
  var nav = document.querySelector(".navigation");
  var navBtn = nav.querySelector(".navigation__toggle");
  var navInner = document.querySelector(".navigation__inner");

  navBtn.addEventListener("click", function(evt) {
    evt.preventDefault();
    if (navBtn.classList.contains("navigation__toggle--opened")) {
      navBtn.classList.remove("navigation__toggle--opened");
      navBtn.classList.add("navigation__toggle--closed");
    } else {
      navBtn.classList.add("navigation__toggle--opened");
      navBtn.classList.remove("navigation__toggle--closed");
    }

    if (navInner.classList.contains("navigation__inner--active")) {
      navInner.classList.remove("navigation__inner--active");
      navInner.classList.add("navigation__inner--closed");
    } else {
      navInner.classList.add("navigation__inner--active");
      navInner.classList.remove("navigation__inner--closed");
    }
    document.querySelector("body").classList.toggle("overlay");
  });

  window.onresize = function () {
    if (window.screen.width > 768) {
      document.querySelector("body").classList.remove("overlay");
      if (navInner.classList.contains("navigation__inner--active")) {
        navInner.classList.remove("navigation__inner--active");
      }
      if (navInner.classList.contains("navigation__inner--closed")) {
        navInner.classList.remove("navigation__inner--closed");
      }
      if (navBtn.classList.contains("navigation__toggle--opened")) {
        navBtn.classList.remove("navigation__toggle--opened");
      }
    }
  }

})();
