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
  async getEmployeeFromUsername(username, isEdit) { //TODO: tech debt: this method is too hardly coupled
    const rosterManager = new RosterManager();
    let response = ``;
    try{
      const supervisor = await rosterManager.getEmployeeFromUsername(username);
      const postURL = isEdit === '1'?`update-employee`:`create-employee`;
      response = `
      <p class="text-sm text-gray-500 mt-2" id="lblSupervisorName" 
        hx-swap-oob="true">
        Supervisor: ${supervisor.name}
      </p>
      <input id="hidSupervisorId" type="hidden" name="hidSupervisorId" hx-swap-oob="true" value="${supervisor.id}">
      <button id="btnAddEmployee" type="submit" class="bg-logoGrey text-white font-bold py-2 px-4 rounded-md"
        hx-post="/roster-manager/${postURL}" hx-target="#roster-list" hx-swap="outerHTML" 
        hx-on:click="document.getElementById('dlgAddEmployee').close()" hx-swap-oob="true">
        Save Changes
      </button>
      `;

    } catch(err){
      response = `
        <p id="lblSupervisorName" class="text-sm text-red-500 mt-2" hx-swap-oob="true">
          Could not find this supervisor, please check supervisor's username
        </p>
        <input id="hidSupervisorId" type="hidden" name="hidSupervisorId" hx-swap-oob="true" value="">
        <button id="btnAddEmployee" type="submit" 
          class="bg-logoGrey text-gray-500 font-bold py-2 px-4 rounded-md" hx-swap-oob="true" disabled>
          Save Changes
        </button>
      `;

    }
    return response;
  }

  /**
   * 
   * @param {*} employee 
   */
  async createEmployee(bodyPayload){
    const rosterManager = new RosterManager();
    try{
      const employee = this.getObjectFromBodyPayload(bodyPayload);      
      await rosterManager.insertEmployee(employee);
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
   * 
   * @param {*} bodyPayload 
   */
  async updateEmployee(bodyPayload){
    const rosterManager = new RosterManager();
    try{
      console.log('payload: ', bodyPayload);
      const employee = this.getObjectFromBodyPayload(bodyPayload);
      const updatedEmployee = await rosterManager.updateEmployee(employee);
      console.log('Updated Employee! ',updatedEmployee);
      return updatedEmployee;
    } catch(err){
      this.errorMessage = err;
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
    const employee = {
      employeeId: bodyPayload.hidEmployeeId,
      employeeName: bodyPayload.txtName === undefined ? bodyPayload.hidEmployeeName : bodyPayload.txtName, //This is a hidden field,
      employeeTitle: bodyPayload.ddlEmployeeTitle,
      apexUsername: bodyPayload.txtUsername === undefined ? bodyPayload.hidEmployeeUsername : bodyPayload.txtUsername,
      supervisorUsername: bodyPayload.txtSupervisorUsername,
      supervisorId: bodyPayload.hidSupervisorId,
      practiceId: bodyPayload.ddlPracticeName, //At this point this control really has the id
      poolId: bodyPayload.ddlDirectorsPool,
      terminatedFlag: bodyPayload.markForDeletion? 1:0
    };
    return employee;
  }
}

module.exports = RosterManagerController;
