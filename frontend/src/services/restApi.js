const ServerResponseError = resp => Error(`Server responded with ${resp.status} ${resp.statusText}`);

const fetchJson = async function(url) {
    const resp = await fetch(url);
    if (resp.status !== 200) {
        throw ServerResponseError(resp);
    }

    return resp.json();
};

export default {
    expense: {
        get: function(kindCode) {
            return fetchJson('api/expense/' + kindCode);
        },
        post: async function({ amount, kindCode, time }) {
            const resp = await fetch('api/expense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount,
                    time,
                    kind: kindCode
                })
            });

            if (resp.status !== 201) {
                throw ServerResponseError(resp);
            }
        }
    },
    summary: {
        get: function(periodCode) {
            return fetchJson('api/summary/' + periodCode);
        }
    }
};
