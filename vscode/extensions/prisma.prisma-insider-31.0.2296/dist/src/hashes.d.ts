/**
 * Get a unique identifier for the project by hashing
 * the directory with `schema.prisma`
 */
export declare function getProjectHash(): Promise<string>;
