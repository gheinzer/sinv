import { existsSync, lstatSync, readFileSync } from 'fs';
import * as http from 'http';
import * as https from 'https';
import mime from 'mime';
import path from 'path';
import { SINVConfig } from '../config';
import { SINVUploads } from './uploads';
import formidable from 'formidable';

export namespace SINVHTTPD {
    const HTTPSOptions: https.ServerOptions = {
        key: readFileSync(SINVConfig.config.httpd.https.key_location),
        cert: readFileSync(SINVConfig.config.httpd.https.cert_location),
    };

    export const serverHTTP: http.Server = http.createServer(requestHandler);
    export const serverHTTPS: https.Server = https.createServer(
        HTTPSOptions,
        requestHandler
    );

    function requestHandler(
        req: http.IncomingMessage,
        res: http.ServerResponse
    ) {
        if (req.method == 'GET' && req.url?.startsWith('/attachment'))
            SINVUploads.handleAttachmentRequest(req, res);
        else if (req.method == 'GET') handleGET(req, res);
        else if (req.method == 'POST' && req.url == '/upload')
            SINVUploads.handleUpload(req, res);
        else res.end();
    }

    /**
     * Initializes the HTTP server and listens on the port specified in the configuration file.
     */
    export function initializeServer() {
        serverHTTP.listen(SINVConfig.config.httpd.http.port);
        serverHTTPS.listen(SINVConfig.config.httpd.https.port);
    }

    function handleGET(req: http.IncomingMessage, res: http.ServerResponse) {
        if (!req.url) {
            res.end();
            return;
        }
        let responsePath = getResponseFilePath(req.url);

        let mimeType = mime.getType(responsePath);
        mimeType ??= 'text/html'; // Default MIME-Type if the mime module could not determine the type

        let reponseBody = readFileSync(responsePath);

        res.setHeader('Content-Type', mimeType);
        res.write(reponseBody);
        res.end();
    }

    /**
     * Generates the response file path.
     * @param requestPath The requested URL.
     * @returns The path in form of a string.
     */
    function getResponseFilePath(requestPath: string) {
        const frontendPath = SINVConfig.config.httpd.content_path;
        let responsePath = `${frontendPath}/index.html`; // Set the default path which is used for non-existant files. Angular will then deal with the routing
        let fullRequestPath = path.join(`${frontendPath}/`, requestPath);
        if (
            existsSync(fullRequestPath) &&
            isInDirectory(frontendPath, fullRequestPath) && // If the file was not in the data directory, users could make requests to any directory of the system, which would obviously be a huge security risk.
            lstatSync(fullRequestPath).isFile()
        ) {
            responsePath = fullRequestPath;
        }
        return responsePath;
    }

    /**
     * Checks if a given directory is inside of another directory. Both paths are relative to the current working directory.
     * @param parent The directory which should be the parent of the child file/directory.
     * @param child The child to check if it is inside of the parent directory.
     * @returns Boolean.
     * @example
     * isInDirectory('foo/bar', 'foo/bar/../baz'); // Returns false
     * isInDirectory('foo/bar', 'foo/bar/baz'); // Returns true
     */
    function isInDirectory(parent: string, child: string) {
        let parentAbsolute = path.resolve(parent);
        let childAbsolute = path.resolve(child);
        return !path.relative(parentAbsolute, childAbsolute).includes('..');
    }
}
