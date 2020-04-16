'use strict';
var pageHeader = document.querySelector('.page-header');
var headerToggle = document.querySelector('.page-header__toggle');

pageHeader.classList.remove('page-header--nojs');

headerToggle.addEventListener('click', function () {
  if (pageHeader.classList.contains('page-header--closed')) {
    pageHeader.classList.remove('page-header--closed');
    pageHeader.classList.add('page-header--opened');
  } else {
    pageHeader.classList.add('page-header--closed');
    pageHeader.classList.remove('page-header--opened');
  }
});



(function() {
  var nav = document.querySelector(".navigation");
  var navBtn = nav.querySelector(".navigation__toggle");
  var navInner = document.querySelector(".navigation__inner");

  navBtn.addEventListener("click", function(evt) {
    evt.preventDefault();
    console.log(navBtn);
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

})();


window.onresize = function () {
  
}