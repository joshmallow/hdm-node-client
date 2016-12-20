exports.nockSuccessfulSearch = function (nock, apiRoot, path, query, result) {
    'use strict';
    query = query === 'boolean' ? query : { q: query };

    return nock(apiRoot)
        .get(path)
        .query(query)
        .reply(200, result);
};

exports.nockSuccessfulDetails = function (nock, apiRoot, path, result) {
    'use strict';

    return nock(apiRoot)
        .get(path)
        .reply(200, result);
};
