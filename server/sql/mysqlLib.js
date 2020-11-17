import mysql from "mysql";
import {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PWD,
  MYSQL_DB,
} from "../../age-verification.config";

var mysqlLib = mysql.createPool({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PWD,
  database: MYSQL_DB,
  connectionLimit: 10,
});

// var mysqlLib = mysql.createPool({
//   host: "192.168.11.128",
//   user: "minhtq",
//   password: "password",
//   database: "shopify_minh",
//   connectionLimit: 10
// });

export default mysqlLib;
