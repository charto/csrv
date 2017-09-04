csrv
====

[![build status](https://travis-ci.org/charto/csrv.svg?branch=master)](http://travis-ci.org/charto/csrv)
[![dependency status](https://david-dm.org/charto/csrv.svg)](https://david-dm.org/charto/csrv)
[![npm version](https://img.shields.io/npm/v/csrv.svg)](https://www.npmjs.com/package/csrv)

This is a simple Node.js -based HTTP server for static files.
No bloat. Under 10 KB download, no dependencies.

Perfect for bundling a fully working demo with frontend JavaScript projects.

Usage
-----

```
  Usage: csrv [OPTION]... DIRECTORY

  Start HTTP server with public root in DIRECTORY.

  Options:

    -p, --port=PORT  Bind to given TCP port (default 8080).
```

Calling from TypeScript
-----------------------

```TypeScript
import { Server } from './Server';

new Server('public_html').listen(8080, (err: null | NodeJS.ErrnoException) => {
    if(!err) console.log('Serving...');
});
```

License
=======

[The MIT License](https://raw.githubusercontent.com/charto/csrv/master/LICENSE)

Copyright (c) 2016-2017 BusFaster Ltd
