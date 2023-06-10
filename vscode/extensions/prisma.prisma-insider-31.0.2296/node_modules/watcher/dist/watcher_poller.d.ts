import { FileType, TargetEvent } from './enums';
import WatcherStats from './watcher_stats';
import { INO, Path } from './types';
declare class WatcherPoller {
    inos: Partial<Record<TargetEvent, Record<Path, [INO, FileType]>>>;
    stats: Map<Path, WatcherStats>;
    getIno(targetPath: Path, event: TargetEvent, type?: FileType): INO | undefined;
    getStats(targetPath: Path): WatcherStats | undefined;
    poll(targetPath: Path, timeout?: number): Promise<WatcherStats | undefined>;
    reset(): void;
    update(targetPath: Path, timeout?: number): Promise<TargetEvent[]>;
    updateIno(targetPath: Path, event: TargetEvent, stats: WatcherStats): void;
    updateStats(targetPath: Path, stats?: WatcherStats): void;
}
export default WatcherPoller;
