import Vue, { PropType } from 'vue'

import { CommunicatingBlockSettings } from '@locokit/lck-glossary'

import { EmittedBlockEvent } from '@/services/lck-api/definitions'
import eventHub from '@/services/lck-event-hub/eventHub'

export default Vue.extend({
  props: {
    settings: {
      type: Object as PropType<CommunicatingBlockSettings>
    },
    pageLoaded: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      eventListeners: [] as Array<{ id: string; relatedFunction: Function }>
    }
  },
  created () {
    if (!this.settings?.caughtEvents) return
    // Listen all the defined events
    for (const [triggerBlockId, caughtEvents] of Object.entries(this.settings.caughtEvents)) {
      const onEventFunction = (eventData: EmittedBlockEvent) => {
        caughtEvents.map(event => {
          // Execute the right functions depending of the configuration
          switch (event.type) {
            case 'select':
              this.onSelectBlockEvent(event.targetField, eventData, triggerBlockId)
              break
            case 'reset':
              this.onResetBlockEvent(event.targetField, triggerBlockId)
              break
          }
        })
      }
      if (onEventFunction) {
        eventHub.$on(triggerBlockId, onEventFunction)
        this.eventListeners.push({ id: triggerBlockId, relatedFunction: onEventFunction })
      }
    }
  },
  destroyed () {
    // Remove all the custom listeners related to the catch events defined in the block settings
    for (const { id, relatedFunction } of this.eventListeners) {
      eventHub.$off(id, relatedFunction)
    }
    this.eventListeners = []
  },
  methods: {
    eventBlockNotImplemented () {
      throw new Error('Block event not implemented.')
    },
    // These methods must be defined in the sub classes if we want to use the related events
    /* eslint-disable @typescript-eslint/no-unused-vars */
    onSelectBlockEvent (columnId: string | undefined, eventData: EmittedBlockEvent, triggerBlockId: string) {
      this.eventBlockNotImplemented()
    },
    onResetBlockEvent (columnId: string | undefined, triggerBlockId: string) {
      this.eventBlockNotImplemented()
    }
    /* eslint-enable @typescript-eslint/no-unused-vars */
  }
})
