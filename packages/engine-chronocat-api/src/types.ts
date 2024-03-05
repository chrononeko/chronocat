export type NtApi<R, A extends unknown[]> = (...args: A) => Promise<R>
