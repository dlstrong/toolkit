import { LitElement, html } from 'lit';
import styles from './navigation.css';


class Navigation extends LitElement {
  static get properties() {
    return {
      compact: { type: Boolean, default: false, attribute: true, reflect: true }
    };
  }

  static get styles() {
    return styles;
  }

  constructor() {
    super();
    this._compact = false;
    document.addEventListener('DOMContentLoaded', this.handleContentLoaded.bind(this));
  }

  get compact() {
    return this._compact;
  }

  set compact(isCompact) {
    const wasCompact = this._compact;
    if (wasCompact !== isCompact) {
      this._compact = isCompact;
      this.requestUpdate('compact', wasCompact);
      this.updateComplete.then(() => {
        const evt = new CustomEvent('compact', { detail: isCompact });
        this.dispatchEvent(evt);
      });
    }
  }

  getHeader() {
    let parent = this.parentElement;
    while (parent) {
      if (parent.nodeName === 'IL-HEADER') {
        return parent;
      }
      parent = parent.parentElement;
    }
    return undefined;
  }

  handleContentLoaded(evt) {
    this.getSections().forEach(section => {
      section.addEventListener('collapse', this.handleSectionCollapse.bind(this));
      section.addEventListener('expand', this.handleSectionExpand.bind(this));
      section.addEventListener('exit', this.handleSectionExit.bind(this));
      section.addEventListener('focus-label', this.handleSectionFocus.bind(this));
      section.addEventListener('blur-label', this.handleSectionBlur.bind(this));
    });
    const header = this.getHeader();
    if (header) {
      header.addEventListener('viewChange', this.handleHeaderViewChange.bind(this));
      this.compact = header.view === 'compact';
    }
    const navcount = this.querySelectorAll('il-nav-section').length;
    if (navcount === 5) {
      this.querySelectorAll('il-nav-section')[4].setAttribute('right', 'true');
    } else if (navcount > 5) {
      this.querySelectorAll('il-nav-section')[navcount - 1].setAttribute('right', 'true');
      this.querySelectorAll('il-nav-section')[navcount - 2].setAttribute('right', 'true');
    }
  }

  handleHeaderViewChange(evt) {
    console.debug(evt);
    this.compact = evt.detail === 'compact';
  }

  handleSectionCollapse(evt) {
  }

  handleSectionExit(evt) {
    const section = evt.currentTarget;
    if (evt.detail === 'back') {
      if (section.previousElementSibling) {
        if (section.previousElementSibling.children.length > 0) {
          section.previousElementSibling.children[0].focus();
        } else {
          section.previousElementSibling.focus();
        }
      } else {
        if (section.parentNode.lastElementChild.children.length > 0) {
          section.parentNode.lastElementChild.children[0].focus();
        } else {
          section.parentNode.lastElementChild.focus();
        }
      }
    } else if (evt.detail === 'forward') {
      if (section.nextElementSibling) {
        if (section.nextElementSibling.children.length > 0) {
          section.nextElementSibling.children[0].focus();
        } else {
          section.nextElementSibling.focus();
        }
      } else {
        if (section.parentNode.firstElementChild.children.length > 0) {
          section.parentNode.firstElementChild.children[0].focus();
        } else {
          section.parentNode.firstElementChild.focus();
        }
      }
    }
  }

  handleSectionExpand(evt) {
    const activeSection = evt.currentTarget;
    this.getSections().forEach(section => {
      if (section.expanded && section !== activeSection) {
        section.collapse();
      }
    });
  }

  handleSectionBlur(evt) {
    this.getSections().forEach(section => {
      if (this.sectionHasChildren(section) && section.shadowRoot.children[0].getElementsByClassName('indicator').length > 0) {
        section.active = false;
        section.shadowRoot.children[0].getElementsByClassName('indicator')[0].classList.remove('selected');
      }
    });
  }

  handleSectionFocus(evt) {
    const activeSection = evt.currentTarget;
    if (this.sectionHasChildren(activeSection) && this.sectionHasIndicator(activeSection)) {
      activeSection.active = true;
      //activeSection.shadowRoot.children[0].classList.add('active');
    }
    this.getSections().forEach(section => {
      if (section !== activeSection) {
        if (this.sectionHasChildren(section) && this.sectionHasIndicator(section)) {
          section.active = false;
          //section.shadowRoot.children[0].classList.remove('active');
        }
      }
    });
  }

  sectionHasChildren(section) {
    return section.shadowRoot.children.length > 0;
  }

  sectionHasIndicator(section) {
    return section.shadowRoot.children[0].getElementsByClassName('indicator').length > 0
  }

  getSections() {
    return this.querySelectorAll('il-nav-section, il-nav-link');
  }

  render() {
    return html`
        <nav class=${this.compact ? 'compact' : 'full'} aria-label='main menu'>
          <ul>
            <slot></slot>
          </ul>
        </nav>`
  }
}

customElements.define('il-nav', Navigation);
