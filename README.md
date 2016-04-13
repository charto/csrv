csrv
====

[![build status](https://travis-ci.org/charto/csrv.svg?branch=master)](http://travis-ci.org/charto/csrv)
[![dependency status](https://david-dm.org/charto/csrv.svg)](https://david-dm.org/charto/csrv)
[![npm version](https://img.shields.io/npm/v/csrv.svg)](https://www.npmjs.com/package/csrv)

This is a web server for Node.js development.

API
===
Docs generated using [`docts`](https://github.com/charto/docts)
>
> <a name="api-Server"></a>
> ### Class [`Server`](#api-Server)
> <em>This is a minimal (but hopefully secure) web server for testing frontends.</em>  
> Source code: [`<>`](http://github.com/charto/csrv/blob/d0a331c/src/Server.ts#L22-L110)  
>  
> Methods:  
> > **new( )** <sup>&rArr; <code>[Server](#api-Server)</code></sup> [`<>`](http://github.com/charto/csrv/blob/d0a331c/src/Server.ts#L23-L30)  
> > &emsp;&#x25aa; basePath <sup><code>string</code></sup>  
> > **.listen( )** <sup>&rArr; <code>void</code></sup> [`<>`](http://github.com/charto/csrv/blob/d0a331c/src/Server.ts#L34-L36)  
> > &emsp;<em>Bind the server to a port. Takes a Node-style callback.</em>  
> > &emsp;&#x25aa; port <sup><code>number</code></sup>  
> > &emsp;&#x25aa; cb <sup><code>(err: ErrnoException) =&gt; void</code></sup>  
> > **.sendStatus( )** <sup>&rArr; <code>void</code></sup> [`<>`](http://github.com/charto/csrv/blob/d0a331c/src/Server.ts#L41-L51)  
> > &emsp;<em>Report status with just the code as a body.</em>  
> > &emsp;<em>Additional headers can be passed eg. for redirecting.</em>  
> > &emsp;&#x25aa; res <sup><code>ServerResponse</code></sup>  
> > &emsp;&#x25aa; status <sup><code>number</code></sup>  
> > &emsp;&#x25ab; header<sub>?</sub> <sup><code>Object</code></sup>  
> > **.processRequest( )** <sup>&rArr; <code>void</code></sup> [`<>`](http://github.com/charto/csrv/blob/d0a331c/src/Server.ts#L53-L105)  
> > &emsp;&#x25aa; req <sup><code>IncomingMessage</code></sup>  
> > &emsp;&#x25aa; res <sup><code>ServerResponse</code></sup>  
>  
> Properties:  
> > **.server** <sup><code>Server</code></sup>  
> > **.basePath** <sup><code>string</code></sup>  

License
=======

[The MIT License](https://raw.githubusercontent.com/charto/csrv/master/LICENSE)

Copyright (c) 2016 BusFaster Ltd
