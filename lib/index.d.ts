import { Mongoose } from 'mongoose';
import { RedisClient } from 'redis';



export interface GooseCacheOptions {
	engine?: 'memory' | 'redis' | 'file';
	port?: number;
	host?: string;
	password?: string;
	client?: RedisClient;
}



export declare class GooseCache {
	constructor(mongoose: Mongoose, cacheOptions: GooseCacheOptions, logLevel?: 'trace' | 'debug' | 'info' | 'warn' | 'error');
	clearCache(key: string | null, cb?: () => void): void;
	clearCachePromise(key: string | null): Promise<void>;
	get(key: string, cb?: () => void);
	getPromise(key: string): Promise<any>;
	set(key: string, value: any, ttl: number, cb?: () => void);
	setPromise(key: string, value: any, ttl: number): Promise<any>;
	evalSha(...args);
	evalShaPromise(...args: any[]): Promise<any>;
	redis: RedisClient;
}

export default GooseCache;



declare module 'mongoose' {

	interface Query<ResultType, DocType extends Document> {
		cache(ttl: number, customKey?: string): this;
		cache(customKey: string): this;
		setDerivedKey(derivedKey: string): this;
		cacheGetScript(sha: string, ...args: any): this;
		postCacheSetScript(sha: string, ...args: any): this;
		postCacheSetDeriveLastArg(derivedKey: string): this;
	}

	interface Aggregate<R> {
		cache(ttl: number, customKey?: string): Array<R> | any;
		cache(customKey: string): Array<R> | any;
	}
	
}
