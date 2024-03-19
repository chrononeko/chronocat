/// <reference types="react" />
declare const errorScopeMap: {
    readonly user: {
        readonly type: "warning";
        readonly title: "需要用户解决";
        readonly children: import("react").JSX.Element;
        readonly badgeName: "需要用户解决";
        readonly badgeClass: "badge--warning";
    };
    readonly dev: {
        readonly type: "warning";
        readonly title: "需要开发者解决";
        readonly children: import("react").JSX.Element;
        readonly badgeName: "需要开发者解决";
        readonly badgeClass: "badge--warning";
    };
    readonly chronocat: {
        readonly type: "warning";
        readonly title: "Chronocat 问题";
        readonly children: import("react").JSX.Element;
        readonly badgeName: "需要开发者解决";
        readonly badgeClass: "badge--warning";
    };
    readonly solved: {
        readonly type: "tip";
        readonly title: "已由 Chronocat 解决";
        readonly children: import("react").JSX.Element;
        readonly badgeName: "已解决";
        readonly badgeClass: "badge--success";
    };
};
export type ErrorScopes = keyof typeof errorScopeMap;
export declare const ErrorScope: ({ scope }: {
    scope: ErrorScopes;
}) => import("react").JSX.Element;
export {};
