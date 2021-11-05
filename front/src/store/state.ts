export class BaseState<T> {
  loading = false
  error: Error | null = null
  data!: T
}
