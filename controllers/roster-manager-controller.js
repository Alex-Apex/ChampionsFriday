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
        employeeTitles: rosterManager.getEmployeeTitles(),
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

  /**
   * 
   * @param {*} employee 
   */
  async createEmployee(bodyPayload){
    const rosterManager = new RosterManager();
    try{
      const employee = this.getObjectFromBodyPayload(bodyPayload);      
      //await rosterManager.insertEmployee(employee);
      this.roster = await rosterManager.getRoster();
    } catch(err){
      this.errorMessage = err;
      
    }
  }

  /**
   * 
   * @param {*} employeeId 
   */
  async getEditEmployeeScreen(employeeId){
    const rosterManager = new RosterManager();
    try{
      const employee = await rosterManager.getEmployee(employeeId);
      const practicesCatalogue = await rosterManager.getPracticesCatalogue();
      const directorsPoolsCatalogue = await rosterManager.getDirectorsPoolsCatalogue();
      const employeeTitles = rosterManager.getEmployeeTitles();
      return {
        title: "Edit Employee",
        employee: employee,
        practices: practicesCatalogue,
        directorsPools: directorsPoolsCatalogue,
        employeeTitles: employeeTitles,
        errorMessage: ''
      };
    }catch(err){
      console.log('error',err);
    }
  }

  /**
   * TODO: is it possibl to do dynamic binding to field names?
   *
   * @returns 
   */
  getFieldsRegistry(){
    return [
      {field: 'txtUsername', dbColumn:'ApexUsername', type:'text'},
      {field: 'txtName', dbColumn:'EmployeName', type:'text'},
      {field: 'ddlEmployeeTitle', dbColumn:'EmployeeTitle', type:'text'},
      {field: 'ddlPracticeName', dbColumn:'PracticeName', type:'int'},
      {field: 'txtSupervisorUsername', dbColumn:'supervisor_username', type:'text'},
      {field: 'ddlDirectorsPool', dbColumn:'pool_id', type:'text'}
    ];
  }

  /**
   * Turns the body payload from a request object into an object that can be used to create an employee   
   * @param {*} bodyPayload 
   * @returns 
   */
  getObjectFromBodyPayload(bodyPayload){
    console.log('INSIDE with payload: ', bodyPayload);

    const employee = {
      employeeName: bodyPayload.txtName,
      employeeTitle: bodyPayload.ddlEmployeeTitle,
      apexUsername: bodyPayload.txtUsername,
      supervisorUsername: bodyPayload.txtSupervisorUsername,
      practiceName: bodyPayload.ddlPracticeName,
      poolId: bodyPayload.ddlDirectorsPool
    };
console.log('--->',employee);
    return employee;
  }
}

module.exports = RosterManagerController;
