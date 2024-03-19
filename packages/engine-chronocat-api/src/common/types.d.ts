export interface CommonSaveResult {
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
    } | undefined;
}
