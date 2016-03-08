// This file is part of csrv, copyright (c) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as fs from 'fs';
import * as url from 'url';
import * as path from 'path';
import * as http from 'http';

var encoding = '; charset=utf-8';

var mimeTbl: {[extension: string]: string} = {
	css: 'text/css' + encoding,
	html: 'text/html' + encoding,
	js: 'text/javascript',
	json: 'application/json',
	xml: 'text/xml',
	png: 'image/png'
};

/** This is a minimal (but hopefully secure) web server to open the frontend in a browser.
  * A proper backend also with nicer development features will be a separate package. */

export class Server {
	constructor(basePath: string) {
		this.basePath = basePath;

		this.server = http.createServer(
			(req: http.IncomingMessage, res: http.ServerResponse) =>
				this.processRequest(req, res)
		);
	}

	listen(port: number) {
		this.server.listen(port, () => {
			console.log('Listening on port ' + port);
		}).on('error', (err: NodeJS.ErrnoException) => {
			if(err.code == 'EACCES' || err.code == 'EADDRINUSE') {
				console.error('Error binding to port ' + port);
				console.error('Try a different one as argument, like npm start -- 8080');
			} else throw(err);
		});
	}

	sendStatus(res: http.ServerResponse, status: number, header?: Object) {
		var body = new Buffer(status + '\n', 'utf-8');

		header = header || {};

		header['Content-Type'] = 'text/plain';
		header['Content-Length'] = body.length;

		res.writeHead(status, header);
		res.end(body);
	}

	processRequest(req: http.IncomingMessage, res: http.ServerResponse) {
		console.log(req.url);

		var urlParts = url.parse(req.url);

		// Paths must start with / and contain maximum one consecutive potentially dangerous
		// special character between alphanumeric characters.

		var pathParts = urlParts.pathname.match(/^\/([@_0-9A-Za-z]+[-./]?)*/);

		// Reject all invalid paths.

		if(!pathParts) return(this.sendStatus(res, 403));

		var urlPath = pathParts[0];

		// Redirect root to the www directory.

		if(urlPath == '/') return(this.sendStatus(res, 302, {
			'Location': '/www/' + (urlParts.search || '')
		}));

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

	basePath: string;
}
