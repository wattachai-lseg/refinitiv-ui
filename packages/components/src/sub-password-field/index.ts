import { css, CSSResultGroup, html, PropertyValues, TemplateResult } from '@refinitiv-ui/core';
import { TemplateMap } from '@refinitiv-ui/core/directives/template-map.js';
import { state } from '@refinitiv-ui/core/decorators/state.js';
import { customElement } from '@refinitiv-ui/core/decorators/custom-element.js';
import { translate, Translate } from '@refinitiv-ui/translate';

import '../sub-icon/index.js';
import { preload } from '../sub-icon/index.js';
import { SubTextField } from '../sub-text-field/index.js';

import '@refinitiv-ui/phrasebook/locale/en/password-field.js';

let isEyeOffPreloadRequested = false;

@customElement('ui-sub-password-field', { theme: false })
export class SubPasswordField extends SubTextField {
  static shadowRootOptions = { ...SubTextField.shadowRootOptions, delegatesFocus: true };

  /**
   * A `CSSResultGroup` that will be used to style the host,
   * slotted children and the internal template of the element.
   * @returns CSS template
   */
  static get styles (): CSSResultGroup {
    return [
      super.styles,
      css`
        :host [part=password-icon] {
          cursor: pointer;

          min-width: 1em;
          box-sizing: border-box;

          font-size: var(--code-only-action-line-height-default);

          margin-left: var(--space-010);
          border: var(--action-border-secondary-default);
          background-color: var(--action-bg-secondary-default);
        }
      `
    ];
  }

  /**
   * Used for translations
   */
  @translate({ scope: 'ui-sub-password-field' })
  protected t!: Translate;

  /**
   * Defines whether password is visible or not
   */
  @state()
  private isPasswordVisible = false;

  /**
   * Called when the element’s DOM has been updated and rendered for the first time
   * @param changedProperties Properties that has changed
   * @return shouldUpdate
   */
  protected firstUpdated (changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);

    if (!isEyeOffPreloadRequested) {
      preload('eye-off');
      isEyeOffPreloadRequested = true;
    }
  }

  /**
   * Decorate `<input>` element with common properties extended from text-field:
   * type="text|password" - text if password is visible
   * @returns template map
   */
  protected get decorateInputMap (): TemplateMap {
    return {
      ...super.decorateInputMap,
      type: this.isPasswordVisible ? 'text' : 'password'
    };
  }

  /**
   * Toggles password visibility state
   * @return void
   */
  protected togglePasswordVisibility (): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  /**
   * Renders icon element
   * @returns {void}
   */
  protected renderPasswordTogglerIcon (): TemplateResult {
    return html`
     <ui-sub-icon
        part="password-icon"
        role="button"
        tabindex="0"
        aria-label="${this.isPasswordVisible ? this.t('HIDE_PASSWORD') : this.t('SHOW_PASSWORD')}"
        icon=${this.isPasswordVisible ? 'eye-off' : 'eye'}
        ?readonly="${this.readonly}"
        ?disabled="${this.disabled}"
        @tap="${this.togglePasswordVisibility}"
      ></ui-sub-icon>
    `;
  }

  /**
   * A `TemplateResult` that will be used
   * to render the updated internal template.
   * @return Render template
   */
  protected render (): TemplateResult {
    return html`
      ${this.renderIcon()}
      ${super.render()}
      ${this.renderPasswordTogglerIcon()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-sub-password-field': SubPasswordField;
  }
}
