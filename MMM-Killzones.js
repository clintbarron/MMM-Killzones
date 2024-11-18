Module.register("MMM-Killzones", {
    // Default module configuration
    defaults: {
        updateInterval: 60000, // Check every minute
        killzones: {
            asia: { enabled: true, start: "20:00", end: "00:00" },
            london: { enabled: true, start: "02:00", end: "05:00" },
            newYork: { enabled: true, start: "07:00", end: "10:00" },
            londonClose: { enabled: true, start: "10:00", end: "12:00" }
        }
    },

    // Define required styles
    getStyles: function() {
        return ["MMM-Killzones.css"];
    },

    // Define start sequence
    start: function() {
        this.currentKillzone = "Not in a killzone. Do not trade";
        this.timeRemaining = "";
        this.scheduleUpdate();
    },

    // Schedule regular updates
    scheduleUpdate: function() {
        setInterval(() => {
            this.updateKillzoneText();
        }, this.config.updateInterval);
        this.updateKillzoneText(); // Initial check
    },

    // Update killzone text and countdown timer
    updateKillzoneText: function() {
        const now = new Date();
        const nyOffset = -5; // New York UTC offset
        const nyTime = new Date(now.getTime() + nyOffset * 3600000);

        const hours = nyTime.getUTCHours();
        const minutes = nyTime.getUTCMinutes();

        const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`;

        let foundKillzone = false;

        for (const [key, killzone] of Object.entries(this.config.killzones)) {
            if (!killzone.enabled) continue;

            const [startHour, startMinute] = killzone.start.split(":").map(Number);
            const [endHour, endMinute] = killzone.end.split(":").map(Number);

            const startTime = new Date(nyTime);
            startTime.setUTCHours(startHour, startMinute, 0);

            const endTime = new Date(nyTime);
            endTime.setUTCHours(endHour, endMinute, 0);

            if (nyTime >= startTime && nyTime < endTime) {
                this.currentKillzone = `In ${key.charAt(0).toUpperCase() + key.slice(1)} Killzone`;
                this.timeRemaining = this.calculateTimeRemaining(nyTime, endTime);
                foundKillzone = true;
                break;
            }
        }

        if (!foundKillzone) {
            this.currentKillzone = "Not in a killzone. Do not trade";
            this.timeRemaining = this.calculateTimeUntilNextKillzone(nyTime);
        }

        this.updateDom(); // Update the display
    },

    // Calculate time remaining in the current killzone
    calculateTimeRemaining: function(currentTime, endTime) {
        const diff = endTime - currentTime;
        const minutes = Math.floor(diff / 60000) % 60;
        const hours = Math.floor(diff / 3600000);

        return `${hours}h ${minutes}m left`;
    },

    // Calculate time until the next killzone starts
    calculateTimeUntilNextKillzone: function(currentTime) {
        let nextStart = null;

        for (const killzone of Object.values(this.config.killzones)) {
            if (!killzone.enabled) continue;

            const [startHour, startMinute] = killzone.start.split(":").map(Number);
            const startTime = new Date(currentTime);
            startTime.setUTCHours(startHour, startMinute, 0);

            if (startTime > currentTime && (!nextStart || startTime < nextStart)) {
                nextStart = startTime;
            }
        }

        if (!nextStart) return "No upcoming killzone";

        const diff = nextStart - currentTime;
        const minutes = Math.floor(diff / 60000) % 60;
        const hours = Math.floor(diff / 3600000);

        return `Next killzone in ${hours}h ${minutes}m`;
    },

    // Generate DOM
    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.className = "killzone-wrapper";

        const killzoneText = document.createElement("div");
        killzoneText.className = "killzone-text";
        killzoneText.innerHTML = this.currentKillzone;

        const countdown = document.createElement("div");
        countdown.className = "killzone-countdown";
        countdown.innerHTML = this.timeRemaining;

        wrapper.appendChild(killzoneText);
        wrapper.appendChild(countdown);

        return wrapper;
    }
});
