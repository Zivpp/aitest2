export interface LineWebhookEvent {
    type: 'message';
    message: {
        type: 'text';
        id: string;
        quoteToken: string;
        markAsReadToken: string;
        text: string;
    };
    webhookEventId: string;
    deliveryContext: {
        isRedelivery: boolean;
    };
    timestamp: number;
    source: {
        type: 'user' | 'group' | 'room';
        userId: string;
        groupId?: string;
        roomId?: string;
    };
    replyToken: string;
    mode: 'active' | 'standby';
}

export interface LineUserProfile {
    userId: string;
    displayName: string;
    pictureUrl?: string;
    statusMessage?: string;
    language?: string;
}
