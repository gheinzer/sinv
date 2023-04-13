import { SINVHTTPD } from './lib/http/httpd';
import { SINVWebSocket } from './lib/ws/ws';
import './api_definitions';
import { SINVUserSystem } from './lib/auth/users';
import { SINVUploads } from './lib/http/uploads';
import { SINVRepositories } from './lib/objects/repositories';
import pkg from './package.json';

SINVHTTPD.initializeServer();
SINVWebSocket.initializeServer();
SINVUserSystem.initializeAdminUser();
SINVRepositories.initializeDefaultRepository();

console.log('sinv ' + pkg.version + ' HTTP and websocket servers initialized.');
