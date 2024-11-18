{
    module: "MMM-Killzones",
    position: "middle_center", // Display in the middle of the screen
    config: {
        updateInterval: 60000,
        killzones: {
            asia: { enabled: true, start: "20:00", end: "00:00" },
            london: { enabled: true, start: "02:00", end: "05:00" },
            newYork: { enabled: true, start: "07:00", end: "10:00" },
            londonClose: { enabled: true, start: "10:00", end: "12:00" }
        }
    }
}
