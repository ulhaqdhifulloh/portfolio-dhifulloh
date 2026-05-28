// js/modules/typewriter.js

class TypeWriter {
  constructor(element, texts, wait = 3000) {
    this.element = element;
    this.texts = texts;
    this.wait = wait;
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.type();
  }

  type() {
    const current = this.textIndex % this.texts.length;
    const fullText = this.texts[current];

    if (this.isDeleting) {
      this.element.textContent = fullText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = fullText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let typeSpeed = this.isDeleting ? 30 : 80;

    if (!this.isDeleting && this.charIndex === fullText.length) {
      typeSpeed = this.wait;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex++;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}
