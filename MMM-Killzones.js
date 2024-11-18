Module.register("MMM-Killzones", {
  // Default module config.
  defaults: {
    timeZone: "America/New_York", // Setting time zone to New York local time
    updateInterval: 1000 * 60, // Update interval every 60 seconds
  },

  getStyles: function () {
    return ["MMM-Killzones.css"];
  },

  start: function () {
    Log.info("Starting module: " + this.name);
    this.currentMessage = "";
    this.nextEventTime = "";
    this.updateKillzone();
    setInterval(() => {
      this.updateKillzone();
    }, this.config.updateInterval);
  },

  updateKillzone: function () {
    const now = moment().tz(this.config.timeZone);
    const times = [
      { message: "In Asia Killzone", start: "20:00", end: "00:00" }, // Asia Killzone
      { message: "In London Open Killzone", start: "02:00", end: "05:00" }, // London Open Killzone
      { message: "In New York Killzone", start: "07:00", end: "10:00" }, // New York Killzone
      { message: "In London Close Killzone", start: "10:00", end: "12:00" }, // London Close Killzone
    ];

    let currentMessage = "Not in a killzone";
    let nextEventTime;

    for (let i = 0; i < times.length; i++) {
      const eventStart = moment.tz(
        times[i].start,
        "HH:mm",
        this.config.timeZone
      );
      const eventEnd = moment.tz(times[i].end, "HH:mm", this.config.timeZone);

      // Handle cases where the end time is past midnight
      if (eventEnd.isBefore(eventStart)) {
        eventEnd.add(1, "day");
      }

      if (now.isBetween(eventStart, eventEnd, null, "[]")) {
        currentMessage = times[i].message;
        nextEventTime = eventEnd;
        break;
      } else if (
        now.isBefore(eventStart) &&
        (!nextEventTime || eventStart.isBefore(nextEventTime))
      ) {
        nextEventTime = eventStart;
      }
    }

    if (!nextEventTime) {
      nextEventTime = moment
        .tz(times[0].start, "HH:mm", this.config.timeZone)
        .add(1, "day");
    }

    this.currentMessage = currentMessage;
    this.nextEventTime = nextEventTime;
    this.updateDom();
  },

  getDom: function () {
    const wrapper = document.createElement("div");
    wrapper.className = "killzone-wrapper";
    wrapper.innerHTML = `<div class="killzone-message">${this.currentMessage}</div>`;

    const countdown = document.createElement("div");
    countdown.className = "killzone-countdown";
    if (this.nextEventTime) {
      const timeRemaining = moment.duration(
        this.nextEventTime.diff(moment().tz(this.config.timeZone))
      );
      countdown.innerHTML = `Time remaining: ${timeRemaining.hours()}h ${timeRemaining.minutes()}m`;
    }
    wrapper.appendChild(countdown);

    return wrapper;
  },
});
