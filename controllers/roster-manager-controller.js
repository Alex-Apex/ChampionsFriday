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
      const practicesCatalogue = await rosterManager.getPracticesCatalogue();
      const directorsPoolsCatalogue = await rosterManager.getDirectorsPoolsCatalogue();

      return {
        title: "Roster Manager",
        roster: this.roster,
        practices: practicesCatalogue,
        directorsPools: directorsPoolsCatalogue,
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

  /**
   * 
   * @param {*} username 
   * @returns 
   */
  async getNameFromUsername(username) {
    const rosterManager = new RosterManager();
    // TODO: need to handle exceptions whenever the result comes back empty
    const supervisorName = await rosterManager.getNameFromUsername(username);    
    return `Supervisor: ${supervisorName}`;
  }
}

module.exports = RosterManagerController;
