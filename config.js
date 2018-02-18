exports.DATABASE_URL =
  process.env.DATABASE_URL ||
  global.DATABASE_URL ||
  "mongodb://localhost/cards-db";

exports.TESTDATABASE_URL =
  process.env.TestDatabase_URL || "mongodb://localhost/test-cards-db";

exports.PORT = process.env.PORT || 8080;

exports.SECRET_KEY = process.env.SECRET_KEY;
