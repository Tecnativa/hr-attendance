# Copyright 2023 Tecnativa - Víctor Martínez
# License LGPL-3 - See http://www.gnu.org/licenses/lgpl-3.0.html

from odoo import models


class HrEmployee(models.Model):
    _inherit = "hr.employee"

    def attendance_manual(self, next_action, entered_pin=None):
        res = super().attendance_manual(
            next_action=next_action, entered_pin=entered_pin
        )
        if self.env.context.get("attendance_reason_id"):
            self.last_attendance_id.attendance_reason_ids = [
                (4, self.env.context.get("attendance_reason_id"))
            ]
        return res
