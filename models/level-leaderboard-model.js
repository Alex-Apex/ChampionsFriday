
const ChampionsFridayModel = require('./champions-friday-model');

class LevelLeaderboardModel{
  constructor(){

  };

  /**
   * 
   * @param {*} filter 
   */
  async getChampionsFridayLeaderboard(filter){
    try{
      let champions = new ChampionsFridayModel();
      let leaderboard = await champions.getChampionsFridayLeaderboardByYear(filter);
  
      return leaderboard;
    }catch(err){
      throw err;
    }
  };
};

module.exports = LevelLeaderboardModel;