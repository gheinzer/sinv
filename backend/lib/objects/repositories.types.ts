import { User as DBUser } from '@prisma/client';
export interface AttachmentData {
    uploadID: string;
    name: string;
    attachmentCategory: string;
    uploadFinished: boolean;
    mimeType: string;
    fileExtension: string;
}

export interface ObjectProperties {
    name: string;
    identifier: string;
    description: string;
    categoryID: number;
    categoryName: string;
    attachments: AttachmentProperties[];
    id: number;
}

export interface SearchResult {
    name: string;
    identifier: string;
    description: string;
    categoryName: string;
}

export interface AttachmentProperties {
    extension: string;
    attachmentID: number;
    name: string;
    categoryID: number;
    categoryName: string;
    fileIconClass?: string;
}
