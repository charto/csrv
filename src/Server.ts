// This file is part of csrv, copyright (c) 2016-2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as fs from 'fs';
import * as URL from 'url';
import * as path from 'path';
import * as http from 'http';

export type RouterType = (
	req: http.IncomingMessage,
	res: http.ServerResponse,
	urlParts: URL.Url,
	urlPath: string
) => string | null | void;

export interface Headers {
	[key: string]: string | string[] | undefined;
};

var encoding = '; charset=utf-8';

var mimeTbl: {[extension: string]: string} = {
	css: 'text/css' + encoding,
	html: 'text/html' + encoding,
	js: 'text/javascript',
	json: 'application/json',
	xml: 'text/xml',
	png: 'image/png'
};

/** This is a minimal (but hopefully secure) web server for testing frontends. */

export class Server {
	constructor(public basePath: string, public router?: RouterType) {
		this.server = http.createServer(
			(
				req: http.IncomingMessage,
				res: http.ServerResponse
			) => this.processRequest(req, res)
		);
	}

	/** Bind the server to a port. Takes a Node-style callback. */

	listen(port: number, handler?: (err: null | NodeJS.ErrnoException) => void) {
		if(handler) {
			this.server.listen(port, () => handler(null)).on('error', handler);
		} else {
			this.server.listen(port);
		}
	}

	/** Report status with just the code as a body.
	  * Additional headers can be passed eg. for redirecting. */

	sendStatus(res: http.ServerResponse, status: number, header: Headers = {}) {
		const body = new Buffer(status + ' ' + http.STATUS_CODES[status] + '\n', 'utf-8');

		header['Content-Type'] = 'text/plain';
		header['Content-Length'] = '' + body.length;

		res.writeHead(status, header);
		res.end(body);
	}

	processRequest(req: http.IncomingMessage, res: http.ServerResponse) {
		console.log(req.url);

		const uri = req.url;

		if(!uri) return(this.sendStatus(res, 403));

		const urlParts = URL.parse(uri);

		// Paths must start with / and contain maximum one consecutive potentially dangerous
		// special character between alphanumeric characters.

		const pathParts = urlParts.pathname!.match(/^\/([@_0-9A-Za-z]+[-./]?)*/);

		// Reject all invalid paths.

		if(!pathParts) return(this.sendStatus(res, 403));

		let urlPath = pathParts[0];

		if(this.router) {
			try {
				const routed = this.router(req, res, urlParts, urlPath);

				if(!routed) return;

				urlPath = routed;
			} catch(err) {
				console.log(err);
				return(this.sendStatus(res, 500));
			}
		}

		// Silently redirect obvious directory paths (ending with a slash) to an index file.

		if(urlPath.match(/\/$/)) urlPath += 'index.html';

		try {
			// Drop initial slash from path and use platform specific path
			// separators (for Windows).

			var filePath = path.join(this.basePath, urlPath.substr(1).replace(/\//g, path.sep));

			var stats = fs.statSync(filePath);

			// Redirect accesses to directories not marked as such; append a slash.

			if(stats.isDirectory()) return(this.sendStatus(res, 302, {
				'Location': urlPath + '/' + (urlParts.search || '')
			}));

			// OK, serve the file.

			var extension = urlPath.substr(urlPath.lastIndexOf('.') + 1);

			res.writeHead(200, {
				'Content-Type': mimeTbl[extension] || 'text/plain' + encoding,
				'Content-Length': stats.size,

				// Don't cache anything, to make sure reloading gives latest version.

				'Cache-Control': 'no-cache, no-store, must-revalidate',
				'Expires': 0
			});

			fs.createReadStream(filePath).pipe(res);
		} catch(err) {
			this.sendStatus(res, 404);
		}
	}

	server: http.Server;
}
