import { join } from 'path';
import { config } from 'dotenv';
config({ path: join(__dirname, '../.env') });

import * as http from 'http';
import app from './app';
import {
  awesomeLogger,
  textLogColor,
  typeLog,
} from './utils/console.logger/awesome.logger';

const port = parseInt(process.env.SERVER_PORT as string) || 3000;
const server = http.createServer(app);
server.listen(port, () => {
  awesomeLogger(
    `[info] - Server is listening at ${port} port.`,
    textLogColor.Green,
    typeLog.Bright,
  );
});
