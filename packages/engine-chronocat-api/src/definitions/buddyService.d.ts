export declare const approvalFriendRequest: import("../types").NtApi<unknown, [{
    approvalInfo: {
        friendUid: string;
        reqTime: string;
        accept: boolean;
    };
}]>;
export declare const delBuddy: import("../types").NtApi<unknown, [{
    delInfo: {
        friendUid: string;
        tempBlock: boolean;
        tempBothDel: boolean;
    };
}]>;
