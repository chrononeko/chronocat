import h from '@satorijs/element';
export declare class LogiriMessager {
    private children;
    private results;
    prepare: () => Promise<void>;
    render: (elements: h[], flush?: boolean) => Promise<void>;
    send: (content: string | null | undefined) => Promise<string[]>;
    flush: () => Promise<void>;
    visit: (element: h) => Promise<void>;
}
