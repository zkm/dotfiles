/// <reference types="node" />
import { FSWatcher } from 'fs';
import { Stats } from 'ripstat';
import { ResultDirectories } from 'tiny-readdir/dist/types';
import { FSTargetEvent, TargetEvent } from './enums';
import WatcherStats from './watcher_stats';
declare type Callback = () => any;
declare type Disposer = () => void;
declare type Event = [TargetEvent, Path, Path?];
declare type FSHandler = (event?: FSTargetEvent, targetName?: string) => void;
declare type Handler = (event: TargetEvent, targetPath: Path, targetPathNext?: Path) => any;
declare type Ignore = (targetPath: Path) => boolean;
declare type INO = bigint | number;
declare type Path = string;
declare type ReaddirMap = ResultDirectories;
declare type LocksAdd = Map<INO, () => void>;
declare type LocksUnlink = Map<INO, () => Path>;
declare type LocksPair = {
    add: LocksAdd;
    unlink: LocksUnlink;
};
declare type LockConfig = {
    ino?: INO;
    targetPath: Path;
    locks: LocksPair;
    events: {
        add: TargetEvent.ADD | TargetEvent.ADD_DIR;
        change?: TargetEvent.CHANGE;
        rename: TargetEvent.RENAME | TargetEvent.RENAME_DIR;
        unlink: TargetEvent.UNLINK | TargetEvent.UNLINK_DIR;
    };
};
declare type PollerConfig = {
    options: WatcherOptions;
    targetPath: Path;
};
declare type SubwatcherConfig = {
    options: WatcherOptions;
    targetPath: Path;
};
declare type WatcherConfig = {
    handler: Handler;
    watcher: FSWatcher;
    options: WatcherOptions;
    folderPath: Path;
    filePath?: Path;
};
declare type WatcherOptions = {
    debounce?: number;
    depth?: number;
    ignore?: Ignore;
    ignoreInitial?: boolean;
    native?: boolean;
    persistent?: boolean;
    pollingInterval?: number;
    pollingTimeout?: number;
    readdirMap?: ReaddirMap;
    recursive?: boolean;
    renameDetection?: boolean;
    renameTimeout?: number;
};
export { Callback, Disposer, Event, FSHandler, FSWatcher, Handler, Ignore, INO, Path, ReaddirMap, Stats, LocksAdd, LocksUnlink, LocksPair, LockConfig, PollerConfig, SubwatcherConfig, WatcherConfig, WatcherOptions, WatcherStats };
