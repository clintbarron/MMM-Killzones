Module.register("MMM-Killzones", {
    // Default module configuration
    defaults: {
        updateInterval: 60000 // Check time every minute
    },

    // Define required styles
    getStyles: function() {
        return ["MMM-Killzones.css"];
    },

    // Define start sequence
    start: function() {
        this.killzoneText = "Not in a killzone. Do not trade";
        this.scheduleUpdate();
    },

    // Schedule regular updates
    scheduleUpdate: function() {
        setInterval(() => {
            this.updateKillzoneText();
        }, this.config.updateInterval);
        this.updateKillzoneText(); // Initial check
    },

    // Update the text based on the time in New York
    updateKillzoneText: function() {
        const now = new Date();
        const nyOffset = -5; // New York UTC offset
        const nyHour = new Date(now.getTime() + nyOffset * 3600000).getUTCHours();

        if (nyHour >= 2 && nyHour < 5) {
            this.killzoneText = "In London Killzone";
        } else if (nyHour >= 7 && nyHour < 10) {
            this.killzoneText = "In New York Killzone";
        } else {
            this.killzoneText = "Not in a killzone. Do not trade";
        }

        this.updateDom(); // Update the display
    },

    // Generate DOM
    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.className = "killzone-text";
        wrapper.innerHTML = this.killzoneText;
        return wrapper;
    }
});
