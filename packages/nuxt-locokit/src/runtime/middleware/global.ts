/**
 * Check if the route need authentication and the user is authenticated.
 */
export function checkPathAvailable(
  needAuthentication: boolean,
  needAnonymous: boolean,
  isAuthenticated: boolean,
): boolean {
  if (needAuthentication && needAnonymous) {
    throw new Error(
      'Could not check path if you want the user to be authenticated and guest at the same time.',
    )
  }
  if (needAuthentication && !isAuthenticated) return false
  return true
}
