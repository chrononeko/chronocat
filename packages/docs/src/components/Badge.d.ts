import React from 'react';
export declare const badgeType: {
    readonly satori: {
        readonly children: "Satori";
        readonly class: string;
    };
    readonly chronocat: {
        readonly children: "Chronocat";
        readonly class: string;
    };
    readonly recv: {
        readonly children: "收";
        readonly class: string;
    };
    readonly primary: {
        readonly children: "";
        readonly class: "badge--primary";
    };
    readonly secondary: {
        readonly children: "";
        readonly class: "badge--secondary";
    };
    readonly success: {
        readonly children: "";
        readonly class: "badge--success";
    };
    readonly introduced: {
        readonly children: "";
        readonly class: "badge--success";
    };
    readonly send: {
        readonly children: "发";
        readonly class: "badge--success";
    };
    readonly info: {
        readonly children: "";
        readonly class: "badge--info";
    };
    readonly warning: {
        readonly children: "";
        readonly class: "badge--warning";
    };
    readonly experimental: {
        readonly children: "实验性";
        readonly class: "badge--warning";
    };
    readonly danger: {
        readonly children: "";
        readonly class: "badge--danger";
    };
    readonly notavailable: {
        readonly children: "未具备";
        readonly class: "badge--danger";
    };
    readonly notimplemented: {
        readonly children: "未实现";
        readonly class: "badge--danger";
    };
};
export type BadgeType = keyof typeof badgeType;
export interface BadgeProps {
    type: BadgeType;
    children?: React.ReactNode;
}
export declare const Badge: ({ type, children }: BadgeProps) => React.JSX.Element;
