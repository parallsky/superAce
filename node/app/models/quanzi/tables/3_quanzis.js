const sql = `create table if not exists quanzis(
  quanId INT NOT NULL AUTO_INCREMENT,
  playerId INT NOT NULL,
  quanName VARCHAR(128) NOT NULL default '',
  quanCode VARCHAR(32) NOT NULL default '',
  quanType INT NOT NULL default 0,
  wpkClubNum INT NOT NULL default 0,
  dpqClubNum INT NOT NULL default 0,
  dpzxClubNum INT NOT NULL default 0,
  quanUserNum INT NOT NULL default 0,
  quanProxyNum INT NOT NULL default 0,
  quanVip INT NOT NULL default 0,
  createAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(playerId) REFERENCES players(playerId),
  primary key(quanId)
);`

module.exports = sql


// quanType: 1: 私密圈、开密码局，1000，  2: 绑定一个俱乐部，加1000，10个+10000
