/**
 * Quarterly leaderboard controller
 */
const ChampionsFridayModel = require('../models/champions-friday-model');
const QuarterlyLeaderboardModel = require('../models/quarterly-leaderboard-model');
const RosterManager = require('../models/roster-manager');

class QuarterlyLeaderboard {
  constructor(){

  }

  /**
   *  
   * @param {*} filter This is a complex object which contains the filters to be applied to the leaderboard
   * @returns
   */
  async getQuarterlyLeaderboardView(filter){
    const CFModel = new ChampionsFridayModel();
    const RMModel = new RosterManager();
    const champions = await CFModel.getChampionsFridayLeaderboard(filter);    //TODO refactor this and only use quarterly LeaderboardMOdel
    const practices = await RMModel.getPracticesCatalogue();

    return {
      layout:'main',
      title:'Champions Friday Quarterly Leaderboard', 
      champions:champions,
      practices: practices,
      currentFilterConfig: filter
    };
  };

  /**
   * Payload contains the username of the employee who is about to earn badges
   * This method calculates the remaining badges as to not repeat any of them in the same quarter.
   * @param {*} reqPayload 
   */
  async getRemainingQuarterBadges(reqPayload){
    const usernameFilter = reqPayload.txtUsername ? `${reqPayload.txtUsername}` : '';
    const dateFilter = reqPayload.txtDateAwarded ? `'${reqPayload.txtDateAwarded}'` : `'${new Date().toISOString().split('T')[0]}'`;
    try {
      if (usernameFilter === '') {
        throw new Error('Username is required and cannot be empty');
      }
      const model = new QuarterlyLeaderboardModel();
      const result = await model.getUsernameQuarterBadges(usernameFilter, dateFilter);
      console.log(`get Quarter Badges: username ${usernameFilter}, date:${dateFilter}`);
      const availableBadges = await model.getMissingBadgesFromResult(result);
      console.log('available: ', availableBadges);
      return { availableBadges };
    } catch (err) {
      console.error(`Failed to get the available badges for the quarter and username provided`, err);
      //TODO put errors in the error message to be returned and rendered. 
      //res.status(400).send(`Failed to get the available badges for the quarter and username provided ${err}`);
    }
  };

  /**
   * 
   * @param {*} reqPayload 
   * @returns 
   */
  async awardBadges(reqPayload){
    console.log('Awarding Badges...');
    const { txtUsername, txtDateAwarded, txtDescription, badges } = reqPayload;
    const badgeList = Array.isArray(badges) ? badges : [badges]; // Ensure badges is an array
  try {
    const model = new QuarterlyLeaderboardModel();
    console.log('Payload: ', reqPayload);
    model.awardBadges(txtUsername, badgeList, txtDateAwarded, txtDescription);
    const champs = await model.getChampionsFridayLeaderboard('*'); // TODO find a way to refresh but with the date specified in the filers 

    return { champions: champs };
  } catch(err) {
    console.error("Error while attempting to award badges:", err);
    //res.status(500).send("Error while attempting to award badges"); // TODO: Handle errors more robustly
    //TODO show error toast on client
    return;
  }
  };

};

module.exports = QuarterlyLeaderboard;