import wepy from 'wepy'

export default class baseMixin extends wepy.mixin {
  /**
   * [公共方法]
   * @param  {[type]}  item [description]
   * @return {Boolean}      [description]
   */
  noop() {
    return null;
  }
  hasOwn(obj, type) {
    return Object.prototype.hasOwnProperty.call(obj, type);
  }

  /**
   * [isXXX 基础方法]
   * @param  {[type]}  item [description]
   * @return {Boolean}      [description]
   */
  isUndefined(item) {
    return typeof item === 'undefined';
  }
  isDefined(item) {
    return !this.isUndefined(item);
  }
  isString(item) {
    return typeof item === 'string';
  }
  isNumber(item) {
    return typeof item === 'number';
  }
  isBoolean(item) {
    return typeof item === 'boolean';
  }
  isArray(item) {
    return Object.prototype.toString.apply(item) === '[object Array]';
  }
  isObject(item) {
    return typeof item === 'object' && !this.isArray(item);
  }
  isFunction(item) {
    return typeof item === 'function';
  }
  formatTime(data) {
    return data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate()
  }

  /**
   * [getXXX 增强方法]
   * @param  {[type]}  item [description]
   * @return {Boolean}      [description]
   */
  getString(item, defaultStr) {
    if (this.isString(item)) return item.trim();
    if (this.isNumber(item)) return `${item}`.trim();
    return defaultStr || '';
  }
  getNumber(item, defaultNum) {
    var matches = this.getString(item).match(/\d+/);
    return this.isNumber(matches && +matches[0]) ? +matches[0] : defaultNum;
  }
  getArray(item, defaultArr) {
    return this.isArray(item) ? item : (defaultArr || []);
  }
  getObject(item, defaultObj) {
    return this.isObject(item) ? item : (defaultObj || {});
  }
  getFunction(item) {
    return this.isFunction(item) ? item : noop;
  }

  /**
   * [JSON方法]
   * @param  {[type]}  item [description]
   * @return {Boolean}      [description]
   */
  $json(item) {
    let str = {
      type: Object.prototype.toString.call(item)
    }
    try {
      str = JSON.stringify(item)
    } catch (e) {
      str.error = e && e.stack || ''
    }
    return this.isString(str) ? str : this.$json(str)
  }
  $parse(item) {
    let obj = {
      type: Object.prototype.toString.call(item)
    }
    try {
      obj = JSON.parse(item)
    } catch (e) {
      obj.error = e && e.stack || ''
    }
    return this.isObject(obj) ? obj : this.$parse(obj)
  }

  /**
   * 表单元素认证
   * required 验证必填元素
   * equalTo      验证两个输入框的内容是否相同
   * minlength 验证最小长度
   * maxlength 验证最大长度
   */
  required(value) {
    if (this.isNumber(value)) {
      value = getString(value)
    } else if (this.isBoolean(value)) {
      return !0
    }
    return (value && value != null) ? true : false
  }
 isPhone(str) {
   return (this.required(str) && str.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[579])[0-9]{8}$/)!==null) ? true : false
 }
  equalTo(value, param) {
    return (this.required(value) && value === param) ? true : false
  }
  minlength(value, param) {
    return (this.required(value) && value.length > param) ? true : false
  }
  maxlength(value, param) {
    return (this.required(value) && value.length < param) ? true : false
  }
  $alert(item = '标题', item2) {
    const param = this.isObject(item) ? Object.assign({
      // 首参数为obj
      title: 'title',
      content: 'content'
    }, item) : this.isString(item) ? this.isString(item2) ? {
      // 俩参数均为字符串
      title: item,
      content: item2
    } : {
      // 只有首参为字符串
      title: '',
      content: item
    } : {
      // 尝试转换字符串
      title: item.toString ? item.toString() : '参数异常'
    }
    wx.showModal(Object.assign({
      showCancel: false
    }, param))
  }
  $modal(text, title = '提示') {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: title,
        content: text,
        showCancel: false,
        success: res => {
          resolve(res);
        },
        fail: res => {
          reject(res);
        }
      })
    })
  }
}
