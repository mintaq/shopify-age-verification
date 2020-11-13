import mysqlLib from "./mysqlLib";

export const getShopSettings = (shop) => {
  let query = `SELECT * FROM age_verifier_settings WHERE shop = '${shop}'`;

  return new Promise(function (resolve, reject) {
    mysqlLib.getConnection(function (err, connection) {
      connection.query(query, function (err, results, fields) {
        connection.release();
        if (err) {
          reject(err);
        }

        resolve(results[0]);
      });
    });
  });
};

export const getUserSettings = (shop) => {
  let query = `SELECT * FROM tbl_usersettings WHERE store_name = '${shop}'`;

  return new Promise(function (resolve, reject) {
    mysqlLib.getConnection(function (err, connection) {
      connection.query(query, function (err, results, fields) {
        connection.release();
        if (err) {
          reject(err);
        }

        resolve(results[0]);
      });
    });
  });
};

export const getShopInstalled = (shop) => {
  let query = `SELECT * FROM shop_installed WHERE shop = '${shop}'`;

  return new Promise(function (resolve, reject) {
    mysqlLib.getConnection(function (err, connection) {
      connection.query(query, function (err, results, fields) {
        connection.release();
        if (err) {
          reject(err);
        }

        resolve(results[0]);
      });
    });
  });
};

export const insertShopInstalled = (data) => {
  const dataKeys = Object.keys(data);
  let sql_Values = "";
  let sql_Fields = "";
  let query = "";
  const date = new Date().toISOString();

  for (let i = 0; i < dataKeys.length; i++) {
    sql_Fields += `${dataKeys[i]}${i == dataKeys.length - 1 ? "" : ", "}`;
    sql_Values += `'${data[dataKeys[i]]}'${i == dataKeys.length - 1 ? "" : ", "}`;
  }

  query = `INSERT INTO shop_installed (${sql_Fields}) VALUES (${sql_Values})`;


  return new Promise(function (resolve, reject) {
    mysqlLib.getConnection(function (err, connection) {
      connection.query(query, function (err, results, fields) {
        connection.release();
        if (err) {
          reject(err);
        }

        resolve(results);
      });
    });
  });
};

export const updateUserSettings = (shop, data) => {
  const dataKeys = Object.keys(data);
  let sql_Set = "";
  let query = "";

  dataKeys.map((field, i) => {
    return (sql_Set += `${field}='${data[field]}'${
      i == dataKeys.length - 1 ? "" : ", "
    }`);
  });

  query = `UPDATE tbl_usersettings SET ${sql_Set} WHERE store_name = '${shop}'`;


  return new Promise(function (resolve, reject) {
    mysqlLib.getConnection(function (err, connection) {
      connection.query(query, function (err, results, fields) {
        connection.release();
        if (err) {
          reject(err);
        }

        resolve(results);
      });
    });
  });
};

export const updateTableRow = (table, data, where) => {
  const dataKeys = Object.keys(data);
  const whereKeys = Object.keys(where);
  let sql_Set = "";
  let sql_Where = "";
  let query = "";

  // console.log(data)

  whereKeys.map((col, i) => {
    sql_Where += `${col} = "${where[col]}"`;
  });

  for (let i = 0; i < dataKeys.length; i++) {
    let value = data[dataKeys[i]];
    let field = dataKeys[i];

    if (value == null) {
      sql_Set += `${field}=NULL`;
    } else if (!Number.isNaN(value) || value == true || value == false) {
      sql_Set += `${field}='${value}'`;
    } else if (typeof value == "object") {
      sql_Set += `${field}=${JSON.stringify(value)}`;
    } else {
      sql_Set += `${field}=${value}`;
    }

    sql_Set += i == dataKeys.length - 1 ? "" : ", ";
  }

  query = `UPDATE ${table} SET ${sql_Set} WHERE ${sql_Where}`;


  return new Promise(function (resolve, reject) {
    mysqlLib.getConnection(function (err, connection) {
      connection.query(query, function (err, results, fields) {
        connection.release();
        if (err) {
          reject(err);
        }

        resolve(results);
      });
    });
  });
};

export const insertTableRow = (table, data) => {
  const dataKeys = Object.keys(data);
  let query = "";
  let sql_Fields = "";
  let sql_Values = "";

  for (let i = 0; i < dataKeys.length; i++) {
    sql_Fields += `${dataKeys[i]}${i == dataKeys.length - 1 ? "" : ", "}`;
    sql_Values += `'${data[dataKeys[i]]}'${
      i == dataKeys.length - 1 ? "" : ", "
    }`;
  }

  query = `INSERT INTO ${table} (${sql_Fields}) VALUES (${sql_Values})`;

  return new Promise(function (resolve, reject) {
    mysqlLib.getConnection(function (err, connection) {
      connection.query(query, function (err, results, fields) {
        connection.release();
        if (err) {
          reject(err);
        }

        resolve(results);
      });
    });
  });
};

export const selectTableRow = (table, field, where) => {
  const whereKeys = Object.keys(where);
  let sql_Where = "";
  let query = "";

  whereKeys.map((col, i) => {
    sql_Where += `${col} = "${where[col]}"`;
  });

  query = `SELECT ${field} FROM ${table} WHERE ${sql_Where}`;

  return new Promise(function (resolve, reject) {
    mysqlLib.getConnection(function (err, connection) {
      connection.query(query, function (err, results, fields) {
        connection.release();
        if (err) {
          reject(err);
        }

        resolve(results[0]);
      });
    });
  });
};

export const deleteTableRow = (table, where) => {
  const whereKeys = Object.keys(where);
  let sql_Where = "";
  let query = "";

  whereKeys.map((col, i) => {
    sql_Where += `${col} = "${where[col]}"`;
  });

  query = `DELETE FROM ${table} WHERE ${sql_Where}`;

  return new Promise(function (resolve, reject) {
    mysqlLib.getConnection(function (err, connection) {
      connection.query(query, function (err, results, fields) {
        connection.release();
        if (err) {
          reject(err);
        }

        resolve(results[0]);
      });
    });
  });
};
