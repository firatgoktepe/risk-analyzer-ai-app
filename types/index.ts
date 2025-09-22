export interface UploadedPhoto {
    file: File;
    preview: string;
    base64: string;
}

export interface AnalysisResult {
    risks: {
        title: string;
        level: "low" | "medium" | "high";
        recommendation: string;
    }[];
}
