export declare class OverlayPanel extends HTMLInputElement {
  /**
   * Toggles the visibility of the overlay.
   * @param {Event} event - Browser event.
   * @param {*} [target] - Optional target if event.currentTarget should not be used.
   *
   * @memberof OverlayPanel
   */
  toggle: (event: Event, target?: any) => void
  /**
   * Shows the overlay.
   * @param {Event} event - Browser event.
   * @param {*} [target] - Optional target if event.currentTarget should not be used.
   *
   * @memberof OverlayPanel
   */
  show: (event: Event, target?: any) => void
  /**
   * Hides the overlay.
   *
   * @memberof OverlayPanel
   */
  hide: () => void
}
