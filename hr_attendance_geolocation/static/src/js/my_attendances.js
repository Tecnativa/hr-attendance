odoo.define("hr_attendance_geolocation.attendances_geolocation", function(require) {
    "use strict";

    // Var BaseMyAttendances = require("base_hr_attendance.my_attendances");
    // var MyAttendances = require("hr_attendance.my_attendances");
    var MyAttendances = require("base_hr_attendance.my_attendances");
    const session = require("web.session");

    return MyAttendances.extend({
        // eslint-disable-next-line no-unused-vars
        init: function(parent, action) {
            console.log("init");
            this._super.apply(this, arguments);
            Object.assign(session.user_context, {
                latitude: 0.0,
                longitude: 0.0,
            });
        },
        update_attendance: function() {
            console.log("update_attendance");
            var self = this;
            var options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 60000,
            };
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    self._manual_attendance.bind(self),
                    self._getPositionError.bind(self),
                    options
                );
            }
        },
        _manual_attendance: function(position) {
            console.log("_manual_attendance");
            Object.assign(session.user_context, {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
            this.updateAttendanceCustom();
        },
        _getPositionError: function(error) {
            console.warn("ERROR(" + error.code + "): " + error.message);
            this.update_attendanceCustom();
        },
    });
});
