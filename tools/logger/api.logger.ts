import { Request, NextFunction, Response } from 'express';
import logger from './winston.logger';

export const apiLogger = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const requestStart = Date.now();
  let body: any = [];
  let requestErrorMessage: any = null;

  const getChunk = (chunk: any) => body.push(chunk);
  const assembleBody = () => {
    body = Buffer.concat(body).toString();
  };
  const getError = (error: { message: any }) => {
    requestErrorMessage = error.message;
  };
  request.on('data', getChunk);
  request.on('end', assembleBody);
  request.on('error', getError);

  const logClose = () => {
    removeHandlers();
    errorLogger(request, response, 'Client aborted.', body, requestStart);
  };
  const logError = (error: { message: any }) => {
    removeHandlers();
    errorLogger(request, response, error.message, body, requestStart);
  };
  const logFinish = () => {
    removeHandlers();
    errorLogger(request, response, requestErrorMessage, body, requestStart);
  };
  response.on('close', logClose);
  response.on('error', logError);
  response.on('finish', logFinish);

  const removeHandlers = () => {
    request.off('data', getChunk);
    request.off('end', assembleBody);
    request.off('error', getError);
    response.off('close', logClose);
    response.off('error', logError);
    response.off('finish', logFinish);
  };

  next();
};

export const errorLogger = (
  request: Request,
  response: Response,
  errorMessage: any,
  body: any,
  requestStart?: number,
  isInternalError?: boolean,
  internalErrorMessage?: string,
) => {
  const { rawHeaders, httpVersion, method, socket, url } = request;
  const { remoteAddress, remoteFamily } = socket;

  const { statusCode, statusMessage } = response;
  const headers = response.getHeaders();

  const processingTime = requestStart ? Date.now() - requestStart : undefined;

  // winston log
  const message = {
    timestamp: Date.now(),
    processingTime,
    rawHeaders,
    body,
    errorMessage,
    httpVersion,
    method,
    remoteAddress,
    remoteFamily,
    url,
    response: {
      statusCode,
      statusMessage,
      headers,
    },
    internalErrorMessage,
  };

  if (isInternalError) {
    logger.error(message);
  } else {
    logger.log('http', message);
  }
};
