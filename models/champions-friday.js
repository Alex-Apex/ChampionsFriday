const MATERIAL_CATALOG = [
  'N/A', // 0 => you have not obtained any badges yet
  'Wood',
  'Bronze',
  'Silver',
  'Gold',
  'Platinum',
  'Diamond'
];

const BADGES_CATALOG = [
  {
    Axis: 'Professional Excellence',
    Badges: ['Champion', 'Integrity', 'Mentor', 'Pro']
  },
  {
    Axis:'Collaborative Synergy', 
    Badges: ['Trailblazer', 'Collaborator','Reliable', 'Visionary']
  },
  {
    Axis: 'Technical Mastery',
    Badges:['Adaptive','Expert', 'Deep Diver', 'Versatile']
  }
];

/**
 * 
 * @returns 
 */
function getAllBadges() {
  const badges = BADGES_CATALOG.reduce((acc, axis) => {    
    return acc.concat(axis.Badges);
  },[]);
  return badges;
}

/**
 * 
 * @param {*} badgeCount 
 * @returns 
 */
function getBadgeMaterial(badgeCount) {
  if(badgeCount>=0  && badgeCount <= 6){
    return MATERIAL_CATALOG[badgeCount];
  } else if(badgeCount>6) {
    return "Unobtanium";
  } else {
    return MATERIAL_CATALOG[0];
  }
}
module.exports = {
  MATERIAL_CATALOG,
  BADGES_CATALOG,
  getAllBadges,
  getBadgeMaterial
};