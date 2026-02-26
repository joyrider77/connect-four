import { type HttpAgentOptions, type ActorConfig, type Agent } from "@dfinity/agent";
import type { Principal } from "@dfinity/principal";
import { CreateActorOptions } from "declarations/backend";
import { _SERVICE } from "declarations/backend/backend.did.d.js";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface HighscoreEntry {
    time: bigint;
    timestamp: bigint;
    playerName: string;
}
export interface FileReference {
    hash: string;
    path: string;
}
export declare const createActor: (canisterId: string | Principal, options?: CreateActorOptions, processError?: (error: unknown) => never) => backendInterface;
export declare const canisterId: string;
export interface backendInterface {
    addHighscore(playerName: string, time: bigint): Promise<void>;
    dropFileReference(path: string): Promise<void>;
    getFileReference(path: string): Promise<FileReference>;
    getHighscores(): Promise<Array<HighscoreEntry>>;
    getTopHighscores(): Promise<Array<HighscoreEntry>>;
    listFileReferences(): Promise<Array<FileReference>>;
    registerFileReference(path: string, hash: string): Promise<void>;
}

