import { SINVAPI } from '../api/api';
import { SINVUploads } from './uploads';

SINVAPI.addAction('uploads/initializeUpload', {
    needsAuthentication: true,
    needsPermissions: ['upload'],
    requiresDataFields: ['mimeType'],
    actionHandler: async (data, auth) => {
        let uploadID = SINVUploads.initializeUpload(
            //@ts-ignore
            auth.sessionID,
            data.mimeType
        );
        return {
            success: true,
            data: { uploadID },
        };
    },
});
