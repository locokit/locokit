export const createSlug = (value: string | null) => {
  if (!value) return ''

  // https://stackoverflow.com/a/37511463
  return value
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accent
    .replace(/\s{2,}/, ' ') // Remove multiple space to one
    .replace(/ /g, '_') // Replace space by underscore
    .replace(/[^a-z0-9_]/g, '') // For prevention
}

export default {
  createSlug,
}
