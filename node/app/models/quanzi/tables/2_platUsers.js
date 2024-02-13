const sql = `create table if not exists platUsers(
  platLogId INT NOT NULL AUTO_INCREMENT,
  playerId INT NOT NULL,
  showId INT NOT NULL,
  nickName VARCHAR(128) NOT NULL default '',
  avatar VARCHAR(128) NOT NULL default '',
  platType INT NOT NULL default 0,
  createAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(playerId) REFERENCES players(playerId),
  primary key(platLogId)
);`

module.exports = sql
