/**
 * Created by on 2017/9/19.
 */

class HttpRequestManager {
    send(url, params, successCallback) {
        var xhr = new XMLHttpRequest();
        var redurl = this._packUrlByParams(url, params);

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                var text = xhr.responseText;
                successCallback.call(this, text);
            }
        };

        xhr.open("GET", redurl, true);
        xhr.send();
    }

    _packUrlByParams(url, params) {
        var pstr = "";
        var index = 1;
        for (var key in params) {
            var val = params[key];
            if (index == 1) {
                pstr = pstr + key + "=" + val;
            } else {
                pstr = pstr + "&" + key + "=" + val;
            }
            index = index + 1;
        }
        var redurl = url;
        if (pstr != "") {
            redurl = url + "?" + pstr;
        }

        return redurl;
    }
}

let manager = new HttpRequestManager();

export default manager;