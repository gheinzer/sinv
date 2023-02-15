import {
    existsSync,
    fstat,
    mkdirSync,
    renameSync,
    readFileSync,
    copyFileSync,
    unlinkSync,
} from 'fs';
import { SINVConfig } from '../config';
import { UploadRequest, UploadedFile } from './uploads.types';
import * as http from 'http';
import formidable from 'formidable';
import { randomUUID } from 'crypto';
import path from 'path';
import { SINVRepositories } from '../objects/repositories';

export namespace SINVUploads {
    let uploadRequests: { [key: string]: UploadRequest } = {};
    let uploadedFiles: { [key: string]: UploadedFile } = {};
    let downloadRequests: {
        [key: string]: { id: string; mimeType: string; fileExtension: string };
    } = {};

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

    export function moveAttachmentFile(
        uploadID: string,
        attachmentID: number
    ): string {
        let upload = uploadedFiles[uploadID];
        if (!upload) throw Error('invalid_upload_id');
        let oldpath = upload.fileObject.filepath;
        let mimeType = upload.fileObject.mimetype;
        if (!mimeType) mimeType = '';
        let newpath = path.resolve(
            SINVConfig.config.uploadDirectory,
            attachmentID.toString()
        );
        // fs.rename does not work across filesytems
        copyFileSync(oldpath, newpath);
        unlinkSync(oldpath);
        delete uploadedFiles[uploadID];
        return mimeType;
    }

    export function handleAttachmentRequest(
        req: http.IncomingMessage,
        res: http.ServerResponse
    ) {
        if (!req.url) {
            res.end();
            return;
        }
        let url = new URL('http://dummyserver/' + req.url); // The dummyserver thing is required for the constructor
        let dlid = url.searchParams.get('dlid');
        if (!dlid) {
            res.statusCode = 400;
            res.end('dlid_null');
            return;
        }
        let downloadRequestData = downloadRequests[dlid];
        if (!downloadRequestData) {
            res.statusCode = 400;
            res.end('dlid_invalid');
            return;
        }
        let attachmentPath = path.resolve(
            SINVConfig.config.uploadDirectory,
            downloadRequestData.id
        );
        if (!existsSync(attachmentPath)) {
            res.statusCode = 400;
            res.end('attachment_not_found');
            delete downloadRequests[dlid];
            return;
        }
        res.setHeader('Content-Type', downloadRequestData.mimeType);
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="attachment.${downloadRequestData.fileExtension}"`
        );
        res.end(readFileSync(attachmentPath));
        delete downloadRequests[dlid];
    }
    export async function initializeDownloadRequest(
        attachmentID: number,
        sessionID: string
    ) {
        let attachmentRow = await prisma.attachment.findUniqueOrThrow({
            where: { id: attachmentID },
            include: { Object: true },
        });
        let repoID = attachmentRow.Object.repositoryId;
        if (!repoID) throw Error('unknown_repo_id');
        let repo = await SINVRepositories.getRepository(repoID);
        await repo.userHasPermissionOrThrow({ sessionID });
        let downloadID: string = randomUUID();
        while (downloadRequests[downloadID]) {
            downloadID = randomUUID();
        }
        downloadRequests[downloadID] = {
            id: attachmentRow.id.toString(),
            mimeType: attachmentRow.mimeType.toString(),
            fileExtension: attachmentRow.fileExtension,
        };
        return downloadID;
    }
}

if (!existsSync(SINVConfig.config.uploadDirectory)) {
    mkdirSync(SINVConfig.config.uploadDirectory, { recursive: true });
}
