import { SINVHTTPD } from './lib/httpd';
import { SINVWebSocket } from './lib/ws/ws';
import './api_definitions';

SINVHTTPD.initializeServer();
SINVWebSocket.initializeServer();
