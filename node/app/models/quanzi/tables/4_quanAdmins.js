const sql = `create table if not exists quanAdmins(
  playerId INT NOT NULL,
  quanId INT NOT NULL,
  adminType INT NOT NULL default 0,
  FOREIGN KEY(playerId) REFERENCES players(playerId),
  FOREIGN KEY(quanId) REFERENCES quanzis(quanId)
);`

module.exports = sql


// quanType: 1: 私密圈、开密码局，1000，  2: 绑定一个俱乐部，加1000，10个+10000
