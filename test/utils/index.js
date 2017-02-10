exports.nockSuccessfulSearch = function (nock, apiRoot, path, query, result, auth) {
    'use strict';
    query = query === 'boolean' ? query : { q: query };

    let scope = nock(apiRoot).get(path).query(query);
    if (auth) {
        scope = scope.basicAuth(auth);
    }

    scope = scope.reply(200, result);
    return scope;
};

exports.nockSuccessfulDetails = function (nock, apiRoot, path, result) {
    'use strict';

    return nock(apiRoot)
        .get(path)
        .reply(200, result);
};
