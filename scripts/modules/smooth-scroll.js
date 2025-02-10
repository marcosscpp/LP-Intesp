export default class SmoothScroll {
  constructor(linksSelector, options) {
    this.internalLinks = document.querySelectorAll(linksSelector);
    if (options === undefined) {
      this.options = { behavior: "smooth", block: "end" };
    } else {
      this.options = options;
    }

    this.scrollToSection = this.scrollToSection.bind(this);
  }

  scrollToSection(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute("href");
    const section = document.querySelector(href);
    console.log(href, section)
    section.scrollIntoView(this.options);

    const url = window.location.href;
    const hashIndex = url.indexOf(href);
    if (hashIndex !== -1) {
      const cleanUrl = url.substring(0, hashIndex);
      history.replaceState(null, null, cleanUrl);
    }
  }

  addLinkEvent() {
    this.internalLinks.forEach((link) =>
      link.addEventListener("click", this.scrollToSection)
    );
  }

  init() {
    if (this.internalLinks.length) {
      this.addLinkEvent();
    }
    return this;
  }
}
