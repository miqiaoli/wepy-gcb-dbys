import wepy from 'wepy';

export default class http {
    static async request(method, url, data, dataState, header) {
        const params = dataState ? data : Object.assign({
            token_access: ''
        }, data)
        const param = {
            url: url,
            method: method,
            data: params,
            header: header
        }
        const res = await wepy.request(param);
        if (this.isSuccess(res)) {
            return res.data;
        } else {
            const message = this.requestException(res)
            const resModal = await wepy.showModal({
                title: '提示',
                content: message.message,
                showCancel: false
            })
            if (resModal.confirm && message.state == 0) {
                wepy.redirectTo({
                    url: '/pages/user/login'
                })
            }
            return message
                // throw this.requestException(res);
        }
    }

    /**
     * 判断请求是否成功
     */
    static isSuccess(res) {
        const wxCode = res.statusCode;
        // 微信请求错误
        if (wxCode !== 200) {
            return false;
        }
        const wxData = res.data;
        // return (wxData.data && wxData.meta.success);
        return (wxData.meta.success);
    }

    /**
     * 异常
     */
    static requestException(res) {
        const error = {};
        // error.statusCode = res.statusCode;
        const wxData = res.data;
        const serverData = wxData.meta;
        if (serverData) {
            // error.serverData = serverData;
            error.false = true
            error.message = serverData.message
            error.state = serverData.state
        }
        return error;
    }

    static get(url, data, dataState, loading = true) {
        return this.request('GET', url, data, dataState, {
            'content-type': 'application/json'
        });
    }

    static put(url, data, dataState, loading = true) {
        return this.request('PUT', url, data, dataState, loading);
    }

    static post(url, data, dataState, loading = true) {
        return this.request('POST', url, data, dataState, {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        });
    }

    static patch(url, data, dataState, loading = true) {
        return this.request('PATCH', url, data, dataState, loading);
    }

    static delete(url, data, dataState, loading = true) {
        return this.request('DELETE', url, data, dataState, loading);
    }
}