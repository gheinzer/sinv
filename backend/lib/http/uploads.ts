import { PrismaClient } from '@prisma/client';
import { existsSync, mkdirSync } from 'fs';
import { SINVConfig } from '../config';
import { UploadRequest, UploadedFile } from './uploads.types';
import * as http from 'http';
import formidable from 'formidable';
import { randomUUID } from 'crypto';

export namespace SINVUploads {
    let uploadRequests: { [key: string]: UploadRequest } = {};
    let uploadedFiles: { [key: string]: UploadedFile } = {};

    const prisma = SINVConfig.getPrismaClient();

    /**
     * Initializes an upload with a upload ID. This needs to be called before uploading a file, otherwise, the file is rejected.
     *
     * @export
     * @param {string} expectedMimeType
     * @param {string} sessionID
     * @returns {string} The upload ID needed to confirm that the upload is allowed.
     */
    export function initializeUpload(sessionID: string, mimeType: string) {
        let uploadID: string = randomUUID();
        while (uploadRequests[uploadID]) {
            uploadID = randomUUID();
        }
        uploadRequests[uploadID] = {
            sessionID,
            mimeType,
        };
        return uploadID;
    }

    export function handleUpload(
        req: http.IncomingMessage,
        res: http.ServerResponse
    ) {
        let form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            if (
                typeof fields.sessionID !== 'string' ||
                typeof fields.uploadID !== 'string' ||
                typeof files.file !== 'object' ||
                typeof fields.mimeType !== 'string'
            ) {
                res.statusCode = 400;
                res.end('not all fields given');
                return;
            }
            let uploadData = uploadRequests[fields.uploadID.toString()];
            if (!uploadRequests[fields.uploadID.toString()]) {
                res.statusCode = 400;
                res.end('invalid upload id');
                return;
            } else if (uploadData.sessionID !== fields.sessionID.toString()) {
                res.statusCode = 400;
                res.end('bad session id');
                return;
            }
            // If everything is ok, save the file.
            if (!Array.isArray(files.file))
                var file: formidable.File = files.file;
            else {
                res.end('tried to upload multiple files.');
                return;
            }
            uploadedFiles[fields.uploadID] = {
                fileObject: files.file,
                mimeType: fields.mimeType,
            }; // The files are saved later when the user saves the attachment
            delete uploadRequests[fields.uploadID];
            res.statusCode = 200;
            res.end('upload completed.');
        });
    }
}

if (existsSync(SINVConfig.config.uploadDirectory)) {
    mkdirSync(SINVConfig.config.uploadDirectory, { recursive: true });
}
