import { gameSessionContract, buildLocalSubject } from '../game-session.contract'
import { MemoryGameRecordStore } from './memory-store'

gameSessionContract('memory', async () => buildLocalSubject(new MemoryGameRecordStore()))
