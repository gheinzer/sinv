import formidable from 'formidable';
export interface UploadRequest {
    sessionID: string;
    mimeType: string;
}

export interface UploadedFile {
    fileObject: formidable.File;
    mimeType: string;
}
