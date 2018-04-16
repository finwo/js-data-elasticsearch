
<img src="https://raw.githubusercontent.com/js-data/js-data/master/js-data.png" alt="js-data logo" title="js-data" align="right" width="96" height="96" />

[![npm](https://img.shields.io/npm/v/js-data-elasticsearch.svg?style=flat-square)](https://npmjs.com/package/js-data-elasticsearch/)
[![Scrutinizer Build](https://img.shields.io/scrutinizer/build/g/trackthis/js-data-elasticsearch.svg?style=flat-square)](https://scrutinizer-ci.com/g/trackthis/js-data-elasticsearch/)
[![Scrutinizer](https://img.shields.io/scrutinizer/g/trackthis/js-data-elasticsearch.svg?style=flat-square)](https://scrutinizer-ci.com/g/trackthis/js-data-elasticsearch/)
[![Scrutinizer Coverage](https://img.shields.io/scrutinizer/coverage/g/trackthis/js-data-elasticsearch.svg?style=flat-square)](https://scrutinizer-ci.com/g/trackthis/js-data-elasticsearch/)
[![npm](https://img.shields.io/npm/l/js-data-elasticsearch.svg?style=flat-square)](https://npmjs.com/package/js-data-elasticsearch/)

# js-data-elasticsearch

An elasticsearch adapter for the JSData Node.js ORM.

### Installation

    npm install --save js-data js-data-elasticsearch 

### Usage

```js
var jsDataElastic = require('js-data-elasticsearch');

/*
 *  Create an instance of ElasticSearchAdapter
 */
var adapter = new jsDataElastic({config: {
    host: 'localhost:9200',
    log: 'trace'
}});

/*
 *  Register the adapter instance
 */
store.registerAdapter('elasticsearch', adapter, { default: true });
```

### JSData Tutorial

Start with the [JSData].

### License

[The MIT License (MIT)]

### Example

```js
var jsData        = require('js-data');
var jsDataElastic = require('js-data-elasticsearch');

/*
 *  Optional
 */
jsData.utils.Promise = require('bluebird');

var config = {
  config: {
    host: 'localhost:9200',
    log: 'trace'
  }
};

var adapter = new jsDataElastic(config);

var container = new jsData.Container({ mapperDefaults: { } });

container.registerAdapter('elasticsearch', adapter, { 'default': true });

container.defineMapper('users');

container
    .count('users')
    .then(function (data) {
        res.send(JSON.stringify(data));
    })
    .catch(function (error) {
        res.send('ERROR<br>' + JSON.stringify(error));
    });

container
    .create('users',{name: 'name', password: 'password'})
    .then(function (data) {
        res.send(JSON.stringify(data));
    })
    .catch(function (error) {
        res.send('ERROR<br>' + JSON.stringify(error));
    });


container
    .findAll('users',{where: { password: { '==': 'password'} } })
    .then(function (data) {
        res.send(JSON.stringify(data));
    })
    .catch(function (error) {
        res.send('ERROR<br>' + JSON.stringify(error));
    });
```
