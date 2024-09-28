const ChampionsFridayModel = require('./champions-friday-model');

class QuarterlyLeaderboardModel {
  constructor(){

  };

  async getUsernameQuarterBadges(usernameFilter, dateFilter){
    let champions = new ChampionsFridayModel();
    return champions.getUsernameQuarterBadges(usernameFilter, dateFilter);
  };
  
  async getMissingBadgesFromResult(result){
    let champions = new ChampionsFridayModel();
    return champions.getMissingBadgesFromResult(result);
  };

  async awardBadges(txtUsername, badgeList, txtDateAwarded, txtDescription){
    const champions = new ChampionsFridayModel();
    return champions.awardBadges(txtUsername, badgeList, txtDateAwarded, txtDescription);
  };

  async getChampionsFridayLeaderboard(usernameFilter){
    let champions = new ChampionsFridayModel();
    return champions.getChampionsFridayLeaderboard(usernameFilter);
  };
};

module.exports = QuarterlyLeaderboardModel;