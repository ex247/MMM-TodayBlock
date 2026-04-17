Module.register("MMM-TodayBlock", {
  defaults: {
    maxEvents: 10,
    timeFormat: "h:mm A",
    showAllDay: true,
    colored: true,
    showHeader: true,
    headerText: "Today",
    showLocation: false
  },

  start() {
    this.events = [];
  },

  notificationReceived(notification, payload) {
    if (notification === "CALENDAR_EVENTS") {
      this.events = this.filterTodayEvents(payload);
      this.updateDom(300);
    }
  },

  filterTodayEvents(events) {
    const now = moment();

    return events
      .filter(event => {
        const start = moment(event.startDate);
        return start.isSame(now, "day");
      })
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, this.config.maxEvents);
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "today-block";

    if (this.config.showHeader) {
      const header = document.createElement("div");
      header.className = "today-header";
      header.innerHTML = this.config.headerText;
      wrapper.appendChild(header);
    }

    if (!this.events.length) {
      const empty = document.createElement("div");
      empty.className = "no-events";
      empty.innerHTML = "No events today 🎉";
      wrapper.appendChild(empty);
      return wrapper;
    }

    this.events.forEach(event => {
      const row = document.createElement("div");
      row.className = "event-row";

      const color = event.color || "#ffffff";

      const dot = document.createElement("span");
      dot.className = "event-dot";
      dot.style.backgroundColor = color;

      const time = document.createElement("span");
      time.className = "event-time";

      if (event.fullDayEvent) {
        time.innerHTML = this.config.showAllDay ? "All Day" : "";
      } else {
        time.innerHTML = moment(event.startDate).format(this.config.timeFormat);
      }

      const title = document.createElement("span");
      title.className = "event-title";
      title.innerHTML = event.title;

      row.appendChild(dot);
      row.appendChild(time);
      row.appendChild(title);

      if (this.config.showLocation && event.location) {
        const location = document.createElement("span");
        location.className = "event-location";

        const shortLocation = event.location.split(",")[0]; // optional trim
        location.innerHTML = `📍 ${shortLocation}`;

        row.appendChild(location);
      }

      wrapper.appendChild(row);
    });

    return wrapper;
  },

  getStyles() {
    return ["MMM-TodayBlock.css"];
  }
});