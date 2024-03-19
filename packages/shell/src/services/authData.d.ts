/**
 * 获取 {@link authData}。
 *
 * 与直接取 {@link authData}
 * 的不同点在于，此方法保证 {@link authData} 存在。
 *
 * 与 selfProfile 的不同点在于，selfProfile 有 nick。
 *
 * @returns {@link authData}。
 */
export declare const getAuthData: () => Promise<{
    account: string;
    mainAccount: '';
    uin: string;
    nickName: '';
    gender: 0;
    age: 0;
    faceUrl: '';
    a2: '';
    d2: '';
    d2key: '';
}>;
