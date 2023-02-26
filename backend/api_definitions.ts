// In this file, all the api definitions are imported.

import './lib/auth/users.api';
import './lib/objects/repositories.api';
import './lib/http/uploads.api';
import { SINVAPI } from './lib/api/api';
import { SINVHTTPD } from './lib/http/httpd';
import path from 'path';
import { SINVConfig } from './lib/config';
import { lstatSync, readFileSync } from 'fs';
import { marked } from 'marked';
import hljs from 'highlight.js';
import { APIResponse } from './lib/api/api.types';

SINVAPI.addAction('docs/getHTML', {
    needsAuthentication: false,
    needsPermissions: [],
    requiresDataFields: ['path'],
    actionHandler: (data, auth) => {
        let responsePath = path.join(
            SINVConfig.config.httpd.docs_path,
            data.path + '.md'
        );
        if (
            SINVHTTPD.isInDirectory('docs', responsePath) &&
            lstatSync(responsePath).isFile()
        ) {
            marked.use({
                highlight: (code, lang, _callback) => {
                    let callback = _callback ?? (() => {});
                    if (!lang) {
                        callback(null, hljs.highlightAuto(code).value);
                    } else {
                        callback(
                            null,
                            hljs.highlight(code, { language: lang }).value
                        );
                    }
                },
                renderer: {
                    codespan(code: string) {
                        return `<code class="codespan">${code}</code>`;
                    },
                    code(code, infotext, escaped) {
                        let lines: string[] = code.split('\n');
                        for (let i = 0; i < lines.length; i++) {
                            lines[i] = `<code>${lines[i]}</code>`;
                        }
                        return `<pre class="codeblock">${lines.join(
                            '\n'
                        )}</pre>`;
                    },
                },
            });
            return new Promise<APIResponse>((resolve, reject) => {
                let html = marked.parse(
                    readFileSync(responsePath).toString(),
                    (error, result) => {
                        resolve({ success: true, data: { html: result } });
                    }
                );
            });
        } else {
            return { success: false, error: 'file_not_found' };
        }
    },
});
