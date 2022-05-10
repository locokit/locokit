/**
 * Util to wait a certain amount of time, with a Promise syntax
 */
export async function wait (duration: number): Promise<unknown> {
  return new Promise(resolve => {
    setTimeout(resolve, duration)
  })
}
