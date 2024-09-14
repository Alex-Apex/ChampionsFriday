const {poolPromise, sql} = require('../database/db');

class RosterManager {
  constructor(team) {    
    this.roster = [];
  }

  /***
   * Retruns all possible employee titles
   */
  getEmployeeTitles(){
    return [
      {id:1, title:'CS - Associate Consultant'},
      {id:2, title:'CS - Consultant'},
      {id:3, title:'CS - Sr. Consultant'},
      {id:4, title:'CS - Lead Consultant'},
      {id:5, title:'CS - Sr. Lead Consultant'},
      {id:6, title:'CS - Managing Consultant'},
      {id:7, title:'CS - Practice Manager'},
      {id:8, title:'CS - Practice Director'},
      {id:9, title:'CS - SR Practice Director'},
      {id:10, title:'CS - Managing Director'}
    ];
  }
  /**
 * Inserts a new employee into the database.
 * @param {object} employee - The employee object containing
 * details to be inserted.
 * @return {Promise<object>} - The inserted employee object.
 */
async insertEmployee(employee) {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    request
        .input('EmployeeName', sql.NVarChar, employee.employeeName)
        .input('EmployeeTitle', sql.NVarChar, employee.employeeTitle)
        .input('ApexUsername', sql.NVarChar, employee.apexUsername)
        .input('SupervisorName', sql.NVarChar, employee.supervisorName)
        .input('PracticeName', sql.NVarChar, employee.practiceName)
        .input('PoolId', sql.NVarChar, employee.poolId);

    const result = await request.execute('InsertEmployee');
    return result.recordset[0];
  } catch (error) {
    console.error('Error inserting employee:', error);
    throw error;
  }
};

/**
 * 
 * @param {*} id 
 */
async getEmployee(id){
  const query = `
  SELECT E.*, Mgr.username AS supervisor_username
  FROM Employees E INNER JOIN Employees Mgr ON E.supervisor_id = Mgr.id 
  WHERE E.id = @employeeId
  `;
  try{
    const pool = await poolPromise;
    const result = await pool.request()
      .input('employeeId', sql.Int, id)
      .query(query);

    if (result.recordset.length > 0) {
      console.log('recordset: ', result.recordset[0]);
      return result.recordset[0]; // Return the name if found
    } else {
      throw new Error('Failed to find the employee assigned to id: ${id}');
    }
  }catch(err){
    console.error('Error fetching employee:', err);
    throw err;
  }
};

  /**
   * 
   * @returns 
   */
  async getRoster() {
    const query = `
   WITH EmployeeHierarchy AS
  (
      SELECT
          id,
          name,
          username,
          current_title,
          supervisor_id,
          practice_id
      FROM
          EMPLOYEES
      WHERE
          id = 2  -- the Id of the director you're starting from
  
      UNION ALL
  
      SELECT
          E.id,
          E.name,
          E.username,
          E.current_title,
          E.supervisor_id,
          E.practice_id
      FROM
          EMPLOYEES E
      INNER JOIN EmployeeHierarchy EH ON E.supervisor_id = EH.id
  )
  SELECT  EHE.id,
          EHE.name,
          EHE.username,
          EHE.current_title,
          EHE.supervisor_id,
          ESup.name AS supervisor_name,
          EHE.practice_id, P.name AS practice_name 
  FROM EmployeeHierarchy EHE INNER JOIN Practices P
    ON EHE.practice_id = P.id
    INNER JOIN Employees ESup
    ON EHE.supervisor_id = ESup.id;
    `;
    //----
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(query);
      return result.recordset; // Return the results
    } catch (err) {
      console.error('RosterManager: Error fetching Organizational Structure', err);
      throw err; // Rethrow the error for handling elsewhere
    }
  }

  /**
   * 
   * @returns 
   */
  async getPracticesCatalogue() {
    const query = `SELECT * FROM Practices`;
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(query);
      return result.recordset; // Return the results
    } catch (err) {
      console.error('RosterManager: Error fetching Practices Catalogue', err);
      throw err; // Rethrow the error for handling elsewhere
    }
  }

  /**
   * 
   */
  async getDirectorsPoolsCatalogue() {
    const query = `
    SELECT DISTINCT(CAST(pool_id AS NVARCHAR(MAX))) AS id
    FROM Employees;`;
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(query);
      return result.recordset; // Return the results
    } catch (err) {
      console.error('RosterManager: Error fetching Practices Catalogue', err);
      throw err; // Rethrow the error for handling elsewhere
    }
  }

  /**
   * Fetches the name that matches the employee's username
   * @param {*} username 
   * @returns 
   */
  async getNameFromUsername(username){    
    const query = `
    SELECT name 
    FROM Employees 
    WHERE username LIKE @username`;
    
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('username', sql.NVarChar, `${username}`)  // Add wildcards for partial matching
        .query(query);
      
      if (result.recordset.length > 0) {
        return result.recordset[0].name; // Return the name if found
      } else {
        return null; // No results found
      }
    } catch (err) {
      console.error('RosterManager: Error fetching name from username', err);
      throw err; // Rethrow the error for handling elsewhere
    }
}

async getEmployeeById(userId){
  const query = `
  SELECT * 
  FROM Employees
  WHERE id = @userId`;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userId', sql.NVarChar , userId)
      .query(query);
    return result.recordset[0];
  } catch (err) {
    console.error('RosterManager: Error fetching employee by id', err);
    throw err; // Rethrow the error for handling elsewhere
  }
}
};

module.exports = RosterManager;