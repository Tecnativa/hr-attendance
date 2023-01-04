# Copyright 2017 Odoo S.A.
# Copyright 2018 ForgeFlow, S.L.
# License LGPL-3 - See http://www.gnu.org/licenses/lgpl-3.0.html

from odoo import fields, models


class HrAttendanceReason(models.Model):
    _name = "hr.attendance.reason"
    _description = "Attendance Reason"
    _order = "sequence,id"

    _sql_constraints = [("unique_code", "UNIQUE(code)", "Code must be unique")]

    sequence = fields.Integer()
    name = fields.Char(
        String="Reason",
        help="Specifies the reason leaving soon or arriving late",
        required=True,
        index=True,
    )
    code = fields.Char("Reason Code")
    action_type = fields.Selection(
        [("sign_in", "Sign in"), ("sign_out", "Sign out")],
        string="Action Type",
        help="Leave empty if it is independent",
    )
    show_in_kiosk_mode = fields.Boolean(string="Show in kiosk mode?")
