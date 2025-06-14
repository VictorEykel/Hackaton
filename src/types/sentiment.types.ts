// types/sentiment.types.ts

export interface SentimentAnalysis {
    messageId: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    score: number;
}

export interface SentimentSummary {
    sessionId: string;
    sentiments: SentimentAnalysis[];
}
