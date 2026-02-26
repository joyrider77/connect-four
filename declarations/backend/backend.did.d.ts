import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface FileReference { 'hash' : string, 'path' : string }
export interface HighscoreEntry {
  'time' : bigint,
  'timestamp' : bigint,
  'playerName' : string,
}
export interface _SERVICE {
  'addHighscore' : ActorMethod<[string, bigint], undefined>,
  'dropFileReference' : ActorMethod<[string], undefined>,
  'getFileReference' : ActorMethod<[string], FileReference>,
  'getHighscores' : ActorMethod<[], Array<HighscoreEntry>>,
  'getTopHighscores' : ActorMethod<[], Array<HighscoreEntry>>,
  'listFileReferences' : ActorMethod<[], Array<FileReference>>,
  'registerFileReference' : ActorMethod<[string, string], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
