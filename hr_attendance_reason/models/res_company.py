# Copyright 2023 Tecnativa - Víctor Martínez
# License LGPL-3 - See http://www.gnu.org/licenses/lgpl-3.0.html

from odoo import fields, models


class ResCompany(models.Model):
    _inherit = "res.company"

    attendance_reasons_in_kiosk = fields.Boolean(
        string="Show attendance reasons in Kiosk"
    )
