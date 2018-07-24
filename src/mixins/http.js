import wepy from 'wepy'

export default class httpMixin extends wepy.mixin {
    // GET请求
    GET(url, params = {}, showToast = true, handler = {}) {
        return this.request('GET', url, params, showToast, handler)
    }

    // POST请求
    POST(url, params = {}, showToast = true, handler = {}) {
        return this.request('POST', url, params, showToast, handler)
    }
    request(method, url, params = {}, showToast = true, handler = {}) {
            handler.url = domain + url
            handler.data = params
            handler.header = {
                'Authorization': 'Bearer ' + db.Get('token')
            }
            handler.method = method
            if (method === 'POST') {
                handler.header['content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
            }

            if (showToast) {
                wepy.showLoading && wepy.showLoading({
                    title: '加载中...',
                    mask: true
                })
            }

            return new Promise((resolve, reject) => {
                handler.success = res => {
                    if (showToast) wepy.hideLoading && wepy.hideLoading()
                    if (res.data.status === 0) {
                        if (showToast) this.ShowToast(res.data.msg, 'success')
                        resolve(res.data)
                    } else {
                        if (showToast) this.ShowToast(res.data.msg || res.data || '网络错误')
                        reject(res)
                    }
                }
                handler.fail = err => {
                    if (showToast) wepy.hideLoading && wepy.hideLoading()
                    if (showToast) this.ShowToast(JSON.stringify(err), 'error', 3000)
                    reject(err)
                }
                wepy.request(handler)
            })
        }
        /* =================== [$get 发起GET请求] =================== */
    $get(url, data, dataState, loading = true) {
        this.request('GET', url, data, dataState, {
            'content-type': 'application/json'
        });
    }

    async request(method, url, data, dataState, header) {
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
                    // if (resModal.confirm && message.state == 0) {
                    //     wepy.redirectTo({
                    //         url: '/pages/user/login'
                    //     })
                    // }
                return
                // throw this.requestException(res);
            }
        }
        /**
         * 判断请求是否成功
         */
    isSuccess(res) {
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
    requestException(res) {
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
}