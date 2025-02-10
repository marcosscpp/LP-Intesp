export default class Faq {
  constructor(faqList) {
    this.faqList = document.querySelectorAll(faqList);
    this.activeClass = "active";
  }

  init() {
    if (this.faqList.length) {
      this.addFaqEvent();
      this.faqList[0].classList.toggle(this.activeClass);
      this.faqList[0].nextElementSibling.classList.toggle(this.activeClass);
    }
  }

  addFaqEvent() {
    this.faqList.forEach((item) => {
      item.parentNode.addEventListener("click", () => this.activeFaqElement(item));
    });
  }

  activeFaqElement(element) {
    element.classList.toggle(this.activeClass);
    element.nextElementSibling.classList.toggle(this.activeClass);
  }
}
