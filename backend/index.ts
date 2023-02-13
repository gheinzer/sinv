import { SINVHTTPD } from './lib/http/httpd';
import { SINVWebSocket } from './lib/ws/ws';
import './api_definitions';
import { SINVUserSystem } from './lib/auth/users';
import { SINVUploads } from './lib/http/uploads';

SINVHTTPD.initializeServer();
SINVWebSocket.initializeServer();
SINVUserSystem.initializeAdminUser();
