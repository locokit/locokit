import { BaserowAdapter } from './adapters/baserow'
import { Connexion } from './adapters/interface'
import { SQLAdapter } from './adapters/sql'

export type EngineAdapter = BaserowAdapter | SQLAdapter

export async function createAdapter(
  adapterOptions: Connexion,
): Promise<EngineAdapter> {
  let adapter
  switch (adapterOptions.type) {
    case 'baserow':
      adapter = new BaserowAdapter(adapterOptions)
      break
    case 'pg':
    case 'sqlite3':
      adapter = new SQLAdapter(adapterOptions)
      break
  }
  await adapter.boot()
  return adapter
}
