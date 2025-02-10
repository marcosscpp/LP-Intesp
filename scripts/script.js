import Faq from "./modules/faq.js";
import SmoothScroll from "./modules/smooth-scroll.js?v=3";
import Modal from "./modules/modal.js";
import Form from "./modules/form.js?v=2";

const smoothScroll = new SmoothScroll("a[href^='#']").init();

const swiper = new Swiper(".courses__slide", {
  autoHeight: true,
  direction: "horizontal",
  grabCursor: true,
  loop: true,

  pagination: {
    el: ".pagination",
    clickable: true,
  },

  spaceBetween: 20,

  breakpoints: {
    1200: {
      slidesPerView: 3,
    },
    720: {
      slidesPerView: 2,
    },
    480: {
      slidesPerView: 1,
    },
  },

  navigation: {
    nextEl: ".next",
    prevEl: ".prev",
  },
});

const form = new Form(document.querySelector("form"))

const modal = new Modal(
  "[data-modal='open']",
  "[data-modal='close']",
  "[data-modal='container']",
  "active"
);
modal.init();

function activatePixel(phpUrl) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", phpUrl, true);
  xhr.send();
}
activatePixel("../pageview.php");

const faq = new Faq("[data-faq] dt");
faq.init();
