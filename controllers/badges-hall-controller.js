class BadgesHallController {
    constructor() {
        // Constructor logic if needed
    }

    /**
     * 
     * @returns {Object} - The view data for the Badges Hall
     */
    getBadgesHallView() {
        return {
            layout: 'main',
            title: 'Badges Hall',
            badges: [
                { name: 'Gold Badge', description: 'Awarded for excellence in coding.' },
                { name: 'Silver Badge', description: 'Awarded for consistent performance.' },
                { name: 'Bronze Badge', description: 'Awarded for participation.' }
            ]
        };
    }
}

module.exports = BadgesHallController;