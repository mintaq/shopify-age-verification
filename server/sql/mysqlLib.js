import mysql from "mysql";

// var mysqlLib = mysql.createPool({
//   host: "192.168.1.80",
//   user: "minhtq",
//   password: "password",
//   database: "shopify_minh",
//   connectionLimit: 10,
// });

var mysqlLib = mysql.createPool({
  host: "192.168.11.128",
  user: "minhtq",
  password: "password",
  database: "shopify_minh",
  connectionLimit: 10
});

// mysqlLib.connect(function(err) {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log("Mysql connected!");
// });

export default mysqlLib;
