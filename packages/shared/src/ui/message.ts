export type LocoKitMessage = {
  status: 'contrast' | 'error' | 'info' | 'secondary' | 'success' | 'warn'
  text: string
}
