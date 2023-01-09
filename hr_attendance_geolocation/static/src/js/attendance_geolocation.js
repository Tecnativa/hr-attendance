odoo.define("hr_attendance_geolocation.attendances_geolocation", function(require) {
    "use strict";

    var MyAttendances = require("hr_attendance.my_attendances");
    var KioskConfirm = require("hr_attendance.kiosk_confirm");
    const session = require("web.session");

    MyAttendances.include({
        // eslint-disable-next-line no-unused-vars
        init: function(parent, action) {
            this._super.apply(this, arguments);
            Object.assign(session.user_context, {
                latitude: 0.0,
                longitude: 0.0,
            });
        },
        update_attendance: function() {
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
    KioskConfirm.include({
        // eslint-disable-next-line no-unused-vars
        init: function(parent, action) {
            this._super.apply(this, arguments);
            Object.assign(session.user_context, {
                latitude: 0.0,
                longitude: 0.0,
            });
        },
        pre_update_attendance: function() {
            var self = this;
            var options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            };
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    self.updateAttendanceGeolocation.bind(self),
                    self._getPositionError.bind(self),
                    options
                );
            }
        },
        updateAttendanceGeolocation: function(position) {
            Object.assign(session.user_context, {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
            this.updateAttendanceCustom();
        },
        _getPositionError: function(error) {
            console.warn("ERROR(" + error.code + "): " + error.message);
            this.updateAttendanceCustom();
        },
    });
});
