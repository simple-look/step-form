import 'webcomponents.js';
import template from './step-form.jade';
import style from './step-form.styl';

class StepForm extends HTMLElement {
  createdCallback() {
    this.createShadowRoot({ mode: 'open' })
      .innerHTML = `<style>${style}</style>${template()}`;

    this.pfx = ['webkit', 'moz', 'MS', 'o', ''];
    this.animation = 'slideInDown:slideOutUp';

    // const $step = this.shadowRoot.querySelector('.step');

    Array.from(this.children).forEach(($page, i) => {
      // $step.appendChild(document.createElement('nice-dot'));
      $page.classList.add('animated', this.animation.in);

      const $buttons = $page.querySelectorAll('button');

      if (i === 0 && $buttons[0]) {
        $buttons[0].onclick = this.next.bind(this);
      } else {
        if ($buttons[0]) $buttons[0].onclick = this.prev.bind(this);
        if ($buttons[1] && this.children.length !== i + 1) {
          $buttons[1].onclick = this.next.bind(this);
        }
      }

      this.prefixedEvent($page, 'animationend', () => {
        const $active = this.$active();

        $page.classList.remove(this.animation.out);
        $active.classList.remove(this.animation.out);

        $page.style.display = 'none';
        $active.style.display = null;
      });
    });

    this.active = 1;
    for (const $page of this.children) $page.style.display = 'none';
    this.$active().style.display = null;
  }

  set animation(animation) {
    const oldAnim = this._animation ? this.animation.in : '';
    const anims = animation.split(':');

    this._animation = {
      in: anims[0],
      out: anims[1],
    };

    for (const $page of this.children) {
      if (oldAnim) $page.classList.remove(oldAnim);
      $page.classList.add(this.animation.in);
    }
  }

  get animation() {
    return this._animation;
  }

  prefixedEvent(element, type, callback) {
    for (let p = 0; p < this.pfx.length; p++) {
      element.addEventListener(`${this.pfx[p]}${type}`, callback);
    }
  }

  prev() {
    this.flip(this.active - 1);
  }

  next() {
    this.flip(this.active + 1);
  }

  $active() {
    return this.children[this.active - 1];
  }

  flip(page) {
    if (page < 1 || page > this.children.length) return false;

    const anim = this.animation;

    this.active = page;

    for (const $page of this.children) {
      if (!$page.style.display) {
        $page.classList.add(anim.out);
      }
    }

    return this;
  }
}

export default StepForm;
