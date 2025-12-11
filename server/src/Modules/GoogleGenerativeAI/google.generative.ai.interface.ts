export interface IUserQIntentObj {
    original: string;
    inferred_question: string;
    keywords: string[];
}

export interface IIntentClassifier {
    original: string;
    inferred_question: string;
    keywords: string[];
    intent: string;
    isValid: boolean;
    isRelated: boolean;
    isTaskCompleted: boolean;
}