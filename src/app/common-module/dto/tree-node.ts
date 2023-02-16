export interface TreeNode {
    name: string;
    title?: string;
    code?: string;
    key?: string;
    data?: any;
    icon?: string;
    expandedIcon?: string;
    collapsedIcon?: string;
    parent?: TreeNode;
    children?: TreeNode[];
    disabled?: boolean;
    isLeaf?: boolean;
    checked?: boolean;
}