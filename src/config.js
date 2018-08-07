// const host = 'http://10.0.0.2/front' //  李成  黄页
const host = 'https://www.otimes.info/front'

const socketHost = 'wss://www.otimes.info' // 测试图片地址

export const __getApi = {
    host,
    socketHost,
    baseHrefUrl: 'https://www.otimes.info',

    //code encryptedData iv 换取openid，unionid,session_key  codero
    _getPrivacyToken: `${host}/wxapp/codero.dbys`,
    _getUnionID: `${host}/wxapp/toAuthorization.dbys`, // 授权登录换取 unionID

    //登录
    _getLogin: `${host}/member/login.dbys`,

    //注销
    _getLogout: `${host}/wxmember/logout.dbys`,

    //判断手机号是否已注册   Valid mobile phone number
    _getValidPhoneNumber: `${host}/regist/telvalid.dbys`,

    //获取手机验证码
    _gettelRegist: `${host}/regist/telRegist.dbys`,

    //注册提交
    _getRegistSubmit: `${host}/regist/submit.dbys`,

    //修改密码获取手机验证码
    _getVerifySMSEdit: `${host}/password/telPassword.dbys`,

    //修改密码找回密码接口
    _getPasswordBack: `${host}/password/validInfo.dbys`,

    //修改密码接口
    _getEditPassword: `${host}/password/findPassword`,

    //获取城市列表
    _getAreas: `${host}/registup/getareas.dbys`,

    //我的订阅模块验证是否绑定手机号
    _getCustomMadetelHasTel: `${host}/customMade/hasTel.dbys`,

    //我的订阅模块绑定手机号发送验证码
    _getCustomMadetelRegist: `${host}/customMade/telMadeInfo.dbys`,

    //我的订阅模块绑定手机号
    _getCustomMadetelBind: `${host}/customMade/telMadeInfoSave.dbys`,

    //我的订阅列表模块
    _getCustomMadeList: `${host}/customMade/seekerMadeInfo.dbys`,

    //我的订阅详情列表模块
    _getCustomMadeInfoList: `${host}/customMade/getMadeInfo.dbys`,

    //发布我的订阅信息模块
    _getCustomMadeInfo: `${host}/customMade/madeInfo.dbys`,

    //修改我的订阅信息模块
    _updateCustomMadeInfo: `${host}/customMade/updateMadeInfo.dbys`,

    //修改订阅状态
    _updateCustomMadeState: `${host}/customMade/updateMadeState.dbys`,

    //我的订阅模块详情
    _getCustomMadeInfoDetaile: `${host}/customMade/getMadeInfoDetaile.dbys`,

    // 黄页接口
    _getCompanyFirstList: `${host}/enter/enlistFirst.dbys`,
    _getCompanyList: `${host}/enter/rolist.dbys`,
    _getCompanyDetail: `${host}/enter/particulars.dbys`, //详情
    _getAllCityList: `${host}/registup/getcitis.dbys`, // 所有城市
    _getCollectionDo: `${host}/enter/collect.dbys`, // 收藏操作
    _getAllCollection: `${host}/enter/collectList.dbys`, // 收藏列表
    _getSearchCollection: `${host}/enter/collectSearch.dbys`, // 收藏搜索

    // 鱼塘历史接口
    _getFishPondList: `https://www.otimes.info/front/wechat/polist.dbys`,
    _getsocketList: `${socketHost}/weixin_haslogin.dbys`,

    _getBaidoLocation: 'https://api.map.baidu.com/geocoder'
}

export default {
    __getApi
}
