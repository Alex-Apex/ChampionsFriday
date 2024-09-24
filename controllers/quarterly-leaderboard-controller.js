/**
 * Quarterly leaderboard controller
 */
const ChampionsFridayModel = require('../models/champions-friday-model');

class QuarterlyLeaderboard {
  constructor(){

  }

  /**
   *  
   * @param {*} filter 
   */
  async getQuarterlyLeaderboardView(filter){
    const CFModel = new ChampionsFridayModel();
    const champions = await CFModel.getChampionsFridayLeaderboard(filter);    
    
    return {
      layout:'main',
      title:'Champions Friday Quarterly Leaderboard', 
      champions:champions
    };
  };
};

module.exports = QuarterlyLeaderboard;