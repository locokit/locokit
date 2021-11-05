export const NAMED_CLASSES = [
  { label: 'danger', value: 'danger' },
  { label: 'warning', value: 'warning' },
  { label: 'success', value: 'success' },
  { label: 'primary', value: 'primary' },
  { label: 'secondary', value: 'secondary' },
]
export const EXTENDED_NAMED_CLASSES = [
  ...NAMED_CLASSES,
  { label: 'black', value: 'black' },
]

export const TEXT_ALIGN_CLASS = [
  { label: 'left', value: 'left' },
  { label: 'right', value: 'right' },
  { label: 'center', value: 'center' },
  { label: 'justify', value: 'justify' },
]

export const ACTIONS_TYPE = [
  { label: 'page_detail_to', value: 'page_detail_to' },
  { label: 'process_trigger', value: 'process_trigger' },
]

export default {
  NAMED_CLASSES,
  ACTIONS_TYPE,
}
