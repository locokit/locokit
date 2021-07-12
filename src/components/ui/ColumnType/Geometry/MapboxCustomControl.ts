import { Control, Map } from 'mapbox-gl'
import { TranslateResult } from 'vue-i18n'

interface MapboxCustomButton {
  label: string | TranslateResult;
  event: keyof HTMLElementEventMap;
  classes: string[];
  listener: EventListener;
}

export default class MapboxCustomControls implements Partial<Control> {
  container: HTMLDivElement | null = null
  map: Map | null = null
  buttons: MapboxCustomButton[] = []
  htmlButtons: HTMLElement[] = []

  constructor (buttonsToAdd: MapboxCustomButton[]) {
    this.buttons = buttonsToAdd
  }

  onAdd (map: Map) {
    this.map = map
    this.container = document.createElement('div')
    this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group'
    for (const button of this.buttons) {
      this.container.appendChild(this.createButton(button))
    }
    return this.container
  }

  onRemove () {
    this.htmlButtons.forEach((htmlButton, index) => {
      const relatedButton = this.buttons[index]
      htmlButton.removeEventListener(relatedButton.event, relatedButton.listener)
    })
    if (this.container) this.container.remove()
    this.map = null
  }

  createButton (buttonToAdd: MapboxCustomButton) {
    const el = document.createElement('button')
    el.className = buttonToAdd.classes.join(' ')
    el.title = buttonToAdd.label.toString()
    el.type = 'button'
    el.addEventListener(buttonToAdd.event, buttonToAdd.listener)
    return el
  }
}
