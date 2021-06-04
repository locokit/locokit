import { LckTableRowData } from '@/services/lck-api/definitions'
import Vue, { PropType } from 'vue'

import { BlockDefaultSettings } from '@locokit/lck-glossary'

export default Vue.extend({
  props: {
    settings: {
      type: Object as PropType<BlockDefaultSettings>,
      default: () => ({ catchEvents: undefined })
    }
  },
  data () {
    return {
      eventListeners: [] as Array<{ id: string; relatedFunction: Function }>
    }
  },
  created () {
    // Listen all the defined catch events
    (this.settings.catchEvents || []).forEach(catchEvent => {
      const { type, columnId = '' } = catchEvent
      // Execute the right function depending of the type event
      const onEventFunction = ((type) => {
        switch (type) {
          case 'select':
            return (eventData: LckTableRowData) => {
              this.onColumnSelect(columnId, eventData)
            }
          case 'reset':
            return () => {
              this.onColumnSelect(columnId, null)
            }
        }
      })(type)
      // Add a listener if the event type is correct
      if (onEventFunction) {
        const eventId = `${catchEvent.type}:${catchEvent.columnId}`
        this.eventListeners.push(
          {
            id: eventId,
            relatedFunction: onEventFunction
          })
        window.pageEventHub.$on(eventId, onEventFunction)
      }
    })
  },
  destroyed () {
    // Remove all the custom listeners related to the catch events defined in the block settings
    for (const { id, relatedFunction } of this.eventListeners) {
      window.pageEventHub.$off(id, relatedFunction)
    }
  },
  methods: {
    eventBlockNotImplemented () {
      throw new Error('Block event not implemented.')
    },
    /* eslint-disable @typescript-eslint/no-unused-vars */
    onColumnSelect (columnId: string, eventData: LckTableRowData | null) {
      this.eventBlockNotImplemented()
    }
    /* eslint-enable @typescript-eslint/no-unused-vars */
  }
})
