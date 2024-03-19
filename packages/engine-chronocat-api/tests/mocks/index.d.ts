/// <reference types="jest" />
import type { ChronocatContext } from '@chronocat/shell';
export declare const ctx: ChronocatContext;
export declare const satoriConfig: {
    readonly type: "satori";
    readonly listen: "0.0.0.0";
    readonly port: 5500;
    readonly self_url: "https://chronocat.vercel.app";
    readonly token: "DEFINE_CHRONO_TOKEN";
    readonly enable: true;
};
export declare const saveResult: {
    filePath: string;
    fileSize: number;
    fileName: string;
    fileMime: string;
    md5: string;
    imageInfo: {
        width: number;
        height: number;
        type: string;
        mime: string;
        wUnits: string;
        hUnits: string;
    };
};
export declare const commonSend: jest.Mock<Promise<RedMessage>, [], any>;
export declare const commonSave: jest.Mock<Promise<{
    filePath: string;
    fileSize: number;
    fileName: string;
    fileMime: string;
    md5: string;
    imageInfo: {
        width: number;
        height: number;
        type: string;
        mime: string;
        wUnits: string;
        hUnits: string;
    };
}>, [], any>;
export declare const commonSendForward: jest.Mock<Promise<void>, [], any>;
