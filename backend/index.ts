import { SINVHTTPD } from './lib/http/httpd';
import { SINVWebSocket } from './lib/ws/ws';
import './api_definitions';
import { SINVUserSystem } from './lib/auth/users';

SINVHTTPD.initializeServer();
SINVWebSocket.initializeServer();
SINVUserSystem.initializeAdminUser();
