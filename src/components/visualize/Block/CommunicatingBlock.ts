import { LckTableRowData } from '@/services/lck-api/definitions'
import Vue, { PropType } from 'vue'

import { BlockDefaultSettings } from '@locokit/lck-glossary'

export default Vue.extend({
  props: {
    settings: {
      type: Object as PropType<BlockDefaultSettings>,
      default: () => ({ caughtEvents: undefined })
    }
  },
  data () {
    return {
      eventListeners: [] as Array<{ id: string; relatedFunction: Function }>
    }
  },
  created () {
    // Listen all the defined events
    for (const [triggerBlockId, caughtEvents] of Object.entries(this.settings.caughtEvents || {})) {
      caughtEvents.map(event => {
        // Execute the right function depending of the type event
        const onEventFunction = (type => {
          switch (type) {
            case 'select':
              return (eventData: LckTableRowData) => {
                this.onColumnSelect(event.targetId, eventData)
              }
            case 'reset':
              return () => {
                this.onColumnSelect(event.targetId, null)
              }
          }
        })(event.type)
        if (onEventFunction) {
          window.eventHub.$on(triggerBlockId, onEventFunction)
          this.eventListeners.push({ id: triggerBlockId, relatedFunction: onEventFunction })
        }
      })
    }
  },
  destroyed () {
    // Remove all the custom listeners related to the catch events defined in the block settings
    for (const { id, relatedFunction } of this.eventListeners) {
      window.eventHub.$off(id, relatedFunction)
    }
    this.eventListeners = []
  },
  methods: {
    eventBlockNotImplemented () {
      throw new Error('Block event not implemented.')
    },
    // These methods must be defined in the sub classes if we want to use the related events
    /* eslint-disable @typescript-eslint/no-unused-vars */
    onColumnSelect (columnId: string, eventData: LckTableRowData | null) {
      this.eventBlockNotImplemented()
    }
    /* eslint-enable @typescript-eslint/no-unused-vars */
  }
})
