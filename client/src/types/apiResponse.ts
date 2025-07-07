export type GroupSummary = {
    _id: string;
    name: string;
    userCount: number;
};

export type User = {
    _id: string;
    fullName: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    groups: GroupSummary[];
};

export type GroupMember = {
    user: User;
    role: 'admin' | 'member';
};

export type Group = {
    _id: string;
    name: string;
    description?: string;
    code: string;
    users: GroupMember[];
    userCount: number;
};

export type GroupDetailResponse = {
    status: string;
    data: { group: Group; }
};

export type ViewGroupsResponse = {
    status: string;
    data: {
        user: {
            _id: string;
            groups: GroupSummary[];
        };
    };
}