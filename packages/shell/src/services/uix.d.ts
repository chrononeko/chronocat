export declare const uix: {
    map: Record<string, string>;
    add: (uid: string, uin: string) => void;
    isUin: (uin: unknown) => boolean;
    isUid: (uid: unknown) => boolean;
    getUin: (uid: string) => string;
    getUid: (uin: string) => string;
};
