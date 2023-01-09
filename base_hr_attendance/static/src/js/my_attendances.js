odoo.define("base_hr_attendance.my_attendances", function(require) {
    "use strict";

    var MyAttendances = require("hr_attendance.my_attendances");
    var core = require("web.core");
    const session = require("web.session");

    // Var MyAttendances = MyAttendances.extend({
    //     updateAttendanceCustom: function() {
    //         this._rpc({
    //             model: "hr.employee",
    //             method: "attendance_manual",
    //             args: [
    //                 [self.employee.id],
    //                 "hr_attendance.hr_attendance_action_my_attendances",
    //             ],
    //             context: session.user_context,
    //         }).then(function(result) {
    //             if (result.action) {
    //                 self.do_action(result.action);
    //             } else if (result.warning) {
    //                 self.do_warn(result.warning);
    //             }
    //         });
    //     },
    // });
    // core.action_registry.add('my_attendances', MyAttendances);

    // return MyAttendances;
    return MyAttendances.extend({
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
    // Core.action_registry.add('my_attendances', MyAttendances);
    // return MyAttendances;
});
