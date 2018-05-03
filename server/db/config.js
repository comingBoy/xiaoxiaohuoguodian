const production = {

  //MYSQL数据库配置
  
  MYSQL: {
    host: "172.16.155.63",
    user: "root",
    password: "lilinfeng123",
    port: "3306",
    database: "cAuth",
    supportBigNumbers: true,
    multipleStatements: true,
    timezone: 'utc'
  }

}

//开发配置
const development = {


  //MYSQL数据库配置
  mysql: {
    host: "localhost",
    user: "root",
    password: "wx505748cb038629ea",
    port: "3306",
    database: "orderSystem",
    charset: 'utf8mb4',
  }

}

//生产配置
const product = {


  //MYSQL数据库配置
  mysql: {
    host: "172.16.155.63",
    user: "root",
    password: "lilinfeng123",
    port: "3306",
    database: "orderSystem",
    charset: 'utf8mb4',
  }

}

const config = product

module.exports = config