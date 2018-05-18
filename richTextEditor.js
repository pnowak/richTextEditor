import TextEditor from 'handsontable/editors/textEditor';
import {
  addClass,
  removeClass,
  empty } from 'handsontable/helpers/dom/element';
import {
  arrayEach,
  arrayMap } from 'handsontable/helpers/array';

/**
 * @private
 * @editor RichTextEditor
 * @class RichTextEditor
 * @dependencies TextEditor
 */
class RichTextEditor extends TextEditor {
  /**
   * Default action items.
   *
   * @returns {Object}
   */
  static get DEFAULT_ACTIONS() {
    return {
      bold: {
        icon: '<strong>B</strong>',
        title: 'Bold',
        cmd: () => document.execCommand('bold'),
        state: () => document.queryCommandState('bold')
      },
      italic: {
        icon: '<em>I</em>',
        title: 'Italic',
        cmd: () => document.execCommand('italic'),
        state: () => document.queryCommandState('italic')
      },
      underline: {
        icon: '<u>U</u>',
        title: 'Underline',
        cmd: () => document.execCommand('underline'),
        state: () => document.queryCommandState('underline')
      },
      strikethrough: {
        icon: '<strike>S</strike>',
        title: 'Strike-through',
        cmd: () => document.execCommand('strikeThrough'),
        state: () => document.queryCommandState('strikeThrough')
      }
    };
  }

  /**
   * @param {Core} hotInstance Handsontable instance
   * @private
   */
  constructor(hotInstance) {
    super(hotInstance);
  }

  init() {
    super.init();
  }

  /**
   * Create richText instance.
   */
  createElements() {
    super.createElements();

    this.richText = document.createElement('DIV');
    this.richText.contentEditable = true;
    this.richTextStyle = this.richText.style;
    addClass(this.richText, 'htRichTextHolder');

    this.actionBar = document.createElement('DIV');
    addClass(this.actionBar, 'htActionBar');

    const toolbarActions = arrayMap(Object.keys(RichTextEditor.DEFAULT_ACTIONS), (action) => RichTextEditor.DEFAULT_ACTIONS[action]);

    arrayEach(toolbarActions, (action) => {
      const button = document.createElement('button');

      button.innerHTML = action.icon;
      button.title = action.title;
      button.setAttribute('type', 'button');
      button.addEventListener('click', () => {
        action.cmd();
        if (action.state) {
          action.state() ? addClass(button, 'active') : removeClass(button, 'active');
        };
        this.focus();
      });

      const listener = () => {
        if (action.state) {
          action.state() ? addClass(button, 'active') : removeClass(button, 'active');
        }
      };

      this.richText.addEventListener('keyup', listener);
      this.richText.addEventListener('mouseup', listener);

      this.actionBar.appendChild(button);
    });

    empty(this.TEXTAREA_PARENT);

    this.TEXTAREA_PARENT.appendChild(this.actionBar);
    this.TEXTAREA_PARENT.appendChild(this.richText);
  }

  /**
   * Prepare editor to appear.
   *
   * @param {Number} row Row index
   * @param {Number} col Column index
   * @param {String} prop Property name (passed when datasource is an array of objects)
   * @param {HTMLTableCellElement} td Table cell element
   * @param {*} originalValue Original value
   * @param {Object} cellProperties Object with cell properties ({@see Core#getCellMeta})
   */
  prepare(row, col, prop, td, originalValue, cellProperties) {
    super.prepare(row, col, prop, td, originalValue, cellProperties);

    this.richText.innerHTML = originalValue;
  }

  /**
   * Open editor.
   *
   * @param {Event} [event=null]
   */
  open(event = null) {
    super.open();
    this.showRichText(event);
  }

  /**
   * Close editor.
   */
  close() {
    this.hideRichText();
    super.close();
  }

  /**
   * Focus editor.
   *
   */
  focus() {
    super.focus();
    this.richText.focus();
  }

  /**
   *  Get editor value.
   *
   * @return {HTMLElement}
   */
  getValue() {
    return this.richText.innerHTML;
  }

  /**
   * Set editor value.
   *
   * @param {HTMLElement} value
   */
  setValue(value) {
    this.richText.innerHTML = value;
  }

  /**
   * Show richText Editor.
   *
   */
  showRichText() {
    this.richTextStyle.display = 'block';
  }

  /**
   * Hide richText Editor.
   */
  hideRichText() {
    arrayEach(Array.from(this.actionBar.childNodes), (button) => {
      removeClass(button, 'active');
    });

    this.richTextStyle.display = 'none';
  }
}

export default RichTextEditor;
