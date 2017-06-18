const xwwwfurlenc = (srcjson) => {
    if(typeof srcjson !== "object")
      if(typeof console !== "undefined"){
        console.log("\"srcjson\" is not a JSON object");
        return null;
      }
    let u = encodeURIComponent;
    let urljson = "";
    let keys = Object.keys(srcjson);
    for(let i=0; i <keys.length; i++){
        urljson += u(keys[i]) + "=" + u(srcjson[keys[i]]);
        if(i < (keys.length-1))urljson+="&";
    }
    return urljson;
}

const CandyFetch = {
    fetchIt: (url, method, body, auth, callback) => {
        let headers={
            'Access-Control-Allow-Origin':'*',
        };
        method=method.toUpperCase().trim();
        if (auth) {
            headers['Authorization'] = `JWT ${auth}`;
        }
        if (['POST', 'PUT'].includes(method)) {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        let request = {
            method: method,
            mode: 'cors',
            headers: headers
        }
        if ((method != 'GET' || method != 'DELETE') && body) {
            request.body=xwwwfurlenc(body);
        }
        fetch(url, request).then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                return response;
            }
        }).then(data => {
            if (data.status) {
                console.log('Error');
            }
            else {
                callback(data);
            }
        });
    },
    getIt: (url, auth, callback) => {
        this.a.fetchIt(url, 'GET', null, auth, callback);
    },
    postIt: (url, auth, body, callback) => {
        this.a.fetchIt(url, 'POST', body, auth, callback);
    },
    putIt: (url, auth, body, callback) => {
        this.a.fetchIt(url, 'PUT', body, auth, callback);
    },
    deleteIt: (url, auth, callback) => {
        this.a.fetchIt(url, 'DELETE', null, auth, callback);
    }
}

export default CandyFetch
