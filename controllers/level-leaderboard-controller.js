const LevelLeaderboardModel = require('../models/level-leaderboard-model');

class LevelLeaderboardController {
  constructor(){

  };

  /**
   * 
   * @param {*} filter 
   * @returns 
   */
  async getLevelsLeaderboardView(filter){
    const lLModel = new LevelLeaderboardModel();
    const champions = await lLModel.getChampionsFridayLeaderboard(filter);
    
    return {
      layout:'main',
      title:'Champions Friday Level Leaderboard', 
      champions:champions
    };
  };
};

module.exports = LevelLeaderboardController;