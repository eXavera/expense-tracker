const ServerResponseError = resp => Error(`Server responded with ${resp.status} ${resp.statusText}`);

export default {
    expense: {
        get: async function(kindCode) {
            const resp = await fetch('api/expense/' + kindCode);
            if (resp.status !== 200) {
                throw ServerResponseError(resp);
            }

            return resp.json();
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
        get: async function(periodCode) {
            const resp = await fetch('api/summary/' + periodCode);
            if (resp.status !== 200) {
                throw ServerResponseError(resp);
            }

            return resp.json();
        }
    }
};
