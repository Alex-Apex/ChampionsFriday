const RosterManager = require('../models/roster-manager');

class RosterManagerController {
  constructor() {
    this.roster = [];
    this.errorMessage = "";
  }

  /**
   * 
   * @returns 
   */
  async getViewObject(){
    const rosterManager = new RosterManager();
    try {
      this.roster = await rosterManager.getRoster();

      return {
        title: "Roster Manager",
        roster: this.roster,
        errorMessage: this.errorMessage
      };
    } catch (err) { // TODO: implement better handling...
      this.errorMessage = err;
      return {
        title: "Roster Manager",
        roster: this.roster,
        errorMessage: this.errorMessage
      };
    }
  }
}

module.exports = RosterManagerController;
