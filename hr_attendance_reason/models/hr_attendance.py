# Copyright 2017 Odoo S.A.
# Copyright 2018 ForgeFlow, S.L.
# Copyright 2025 Tecnativa - Víctor Martínez
# License LGPL-3 - See http://www.gnu.org/licenses/lgpl-3.0.html

from odoo import Command, fields, models


class HrAttendance(models.Model):
    _inherit = "hr.attendance"

    attendance_reason_ids = fields.Many2many(
        comodel_name="hr.attendance.reason",
        string="Attendance Reason",
        help="Specifies the reason for signing In/signing Out in case of "
        "less or extra hours.",
    )

    def _cron_auto_check_out(self):
        self = self.with_context(cron_auto_check_out=True)
        return super()._cron_auto_check_out()

    def write(self, vals):
        # If cron is running and auto_check_out is defined, we auto-define the out
        # reason automatically.
        # It is not possible to do otherwise
        # https://github.com/odoo/odoo/blob/1dfa4cc9d259b4918424a07394938e24da8c643d/addons/hr_attendance/models/hr_attendance.py#L724
        if self.env.context.get("cron_auto_check_out"):
            if (
                vals.get("check_out")
                and vals.get("out_mode")
                and vals.get("out_mode") == "auto_check_out"
            ):
                out_reason = self.employee_id.company_id.auto_check_out_reason_id
                if out_reason:
                    vals["attendance_reason_ids"] = [Command.link(out_reason.id)]
        return super().write(vals)
