odoo.define("base_hr_attendance.base_hr_attendance", function(require) {
    "use strict";

    var MyAttendances = require("hr_attendance.my_attendances");
    var KioskConfirm = require("hr_attendance.kiosk_confirm");
    const session = require("web.session");

    MyAttendances.include({
        updateAttendanceCustom: function() {
            this._rpc({
                model: "hr.employee",
                method: "attendance_manual",
                args: [
                    [self.employee.id],
                    "hr_attendance.hr_attendance_action_my_attendances",
                ],
                context: session.user_context,
            }).then(function(result) {
                if (result.action) {
                    self.do_action(result.action);
                } else if (result.warning) {
                    self.do_warn(result.warning);
                }
            });
        },
    });
    KioskConfirm.include({
        events: _.extend(KioskConfirm.prototype.events, {
            "click .o_hr_attendance_sign_in_out_icon": _.debounce(
                function() {
                    this.updateAttendance();
                },
                200,
                true
            ),
            "click .o_hr_attendance_pin_pad_button_ok": _.debounce(
                function() {
                    this.pin_pad = true;
                    this.updateAttendance();
                },
                200,
                true
            ),
        }),
        updateAttendance: function() {
            this.updateAttendanceCustom();
        },
        updateAttendanceCustom: function() {
            var self = this;
            var pinBoxVal = null;
            if (this.pin_pad) {
                this.$(".o_hr_attendance_pin_pad_button_ok").attr(
                    "disabled",
                    "disabled"
                );
                pinBoxVal = this.$(".o_hr_attendance_PINbox").val();
            }
            this._rpc({
                model: "hr.employee",
                method: "attendance_manual",
                args: [[this.employee_id], this.next_action, pinBoxVal],
                context: session.user_context,
            }).then(function(result) {
                if (result.action) {
                    self.do_action(result.action);
                } else if (result.warning) {
                    self.do_warn(result.warning);
                    if (self.pin_pad) {
                        self.$(".o_hr_attendance_PINbox").val("");
                        setTimeout(function() {
                            self.$(".o_hr_attendance_pin_pad_button_ok").removeAttr(
                                "disabled"
                            );
                        }, 500);
                    }
                    self.pin_pad = false;
                }
            });
        },
    });
});
