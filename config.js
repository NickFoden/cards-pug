exports.DATABASE_URL =
  // process.env.DATABASE_URL
  "mongodb://cards-user:BlueCity25!@ds129031.mlab.com:29031/cards_js" ||
  global.DATABASE_URL ||
  "mongodb://localhost/cards-db";

exports.TESTDATABASE_URL =
  process.env.TestDatabase_URL || "mongodb://localhost/test-cards-db";

exports.PORT = process.env.PORT || 8080;
