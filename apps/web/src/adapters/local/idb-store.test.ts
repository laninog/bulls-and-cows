import 'fake-indexeddb/auto'
import { IDBFactory } from 'fake-indexeddb'
import { gameSessionContract, buildLocalSubject } from '../game-session.contract'
import { IdbGameRecordStore } from './idb-store'

gameSessionContract('indexeddb', async () => {
  // Base de datos limpia por test: nueva fábrica global.
  globalThis.indexedDB = new IDBFactory()
  return buildLocalSubject(new IdbGameRecordStore())
})
