const sql = `create table if not exists players(
  playerId INT NOT NULL AUTO_INCREMENT,
  nameStr VARCHAR(128) NOT NULL default '',
  contryCode VARCHAR(16) NOT NULL default '',
  phoneNum VARCHAR(64) NOT NULL default '',
  password VARCHAR(128) NOT NULL default '',
  payPwd VARCHAR(6) NOT NULL default '',
  shareCode VARCHAR(16) NOT NULL default '',
  md5UserId VARCHAR(32) NOT NULL default '',
  platType INT NOT NULL default 0,
  fundTotal DECIMAL(12, 2) NOT NULL default 0,
  quanTotal INT NOT NULL default 0,
  diamondNum INT NOT NULL default 0,
  vipLevel INT NOT NULL default 0,
  isSuperAdmin TINYINT(1) NOT NULL default 0,
  createAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  primary key(playerId)
) engine=INNODB auto_increment=10000000;`

module.exports = sql
