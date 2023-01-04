odoo.define("hr_attendance_reason.attendance_reason", function(require) {
    "use strict";

    var MyAttendances = require("hr_attendance.my_attendances");
    var core = require("web.core");
    var _t = core._t;

    MyAttendances.include({
        // eslint-disable-next-line no-unused-vars
        init: function(parent, action) {
            var self = this;
            this._super.apply(this, arguments);
            this._rpc({
                model: "res.company",
                method: "search_read",
                args: [
                    [["id", "=", this.getSession().company_id]],
                    ["attendance_reasons_in_kiosk"],
                ],
            }).then(function(res) {
                self.attendance_reasons_in_kiosk = res[0].attendance_reasons_in_kiosk;
            });
            this.reasons = this.getAttendanceReasons();
        },
        getAttendanceReasons: function() {
            var self = this;
            this.reasons = [];
            this._rpc({
                model: "hr.attendance.reason",
                method: "search_read",
                fields: ["name", "action_type"],
                domain: [["show_in_kiosk_mode", "=", true]],
            }).then(function(reasons) {
                _.each(reasons, function(reason) {
                    self.reasons.push(reason);
                });
            });
            return this.reasons;
        },
        update_attendance: function() {
            var self = this;
            var context = self.controlPanelParams.context;
            delete context.params;
            context.attendance_reason_id = parseInt(
                this.$(".o_hr_attendance_reason").val(),
                0
            );
            if (context.attendance_reason_id === 0) {
                self.do_warn(_t("Please, select a reason"));
            } else {
                this._rpc({
                    model: "hr.employee",
                    method: "attendance_manual",
                    args: [
                        [self.employee.id],
                        "hr_attendance.hr_attendance_action_my_attendances",
                    ],
                    context: context,
                }).then(function(result) {
                    if (result.action) {
                        self.do_action(result.action);
                    } else if (result.warning) {
                        self.do_warn(result.warning);
                    }
                });
            }
        },
    });
});
