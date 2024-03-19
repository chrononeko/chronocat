import type { ContactListType } from '@chronocat/red';
export declare const fetchAndSubscribeABatchOfRecentContact: import("../types").NtApi<{
    result: 0;
    errMsg: '';
}, [{
    fetchParam: {
        anchorPointContact: {
            contactId: string;
            sortField: string;
            pos: number;
        };
        relativeMoveCount: number;
        listType: ContactListType;
        count: number;
        fetchOld: boolean;
    };
}]>;
