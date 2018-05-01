  /**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://gwdpixbu.qcloud.la';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        requestUrl: `${host}/weapp/user`,

        tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口
        uploadImgUrl: `${host}/weapp/upload`,
   
        getFoodTypeListUrl: `${host}/weapp/getFoodTypeList`,

        getFoodListUrl: `${host}/weapp/getFoodList`,

        getFoodList0Url: `${host}/weapp/getFoodList0`,

        getShopInfoUrl: `${host}/weapp/getShopInfo`,

        newOrderUrl: `${host}/weapp/newOrder`,

        finishOrderUrl: `${host}/weapp/finishOrder`,

        newFoodTypeUrl: `${host}/weapp/newFoodType`,

        changeShopTimeUrl: `${host}/weapp/changeShopTime`,

        newFoodUrl: `${host}/weapp/newFood`,

        getOrderUrl: `${host}/weapp/getOrder`,

        getMyOrderUrl: `${host}/weapp/getMyOrder`,

        changeSellUrl: `${host}/weapp/changeSell`,

        changeShopStatusUrl: `${host}/weapp/changeShopStatus`,

    }
};

module.exports = config;
