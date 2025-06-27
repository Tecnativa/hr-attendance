# Copyright 2017 Odoo S.A.
# Copyright 2018 ForgeFlow, S.L.
# Copyright 2023-2025 Tecnativa - Víctor Martínez
# License LGPL-3 - See http://www.gnu.org/licenses/lgpl-3.0.html

from datetime import datetime

from freezegun import freeze_time

from odoo.tests import new_test_user, users
from odoo.tools import DEFAULT_SERVER_DATETIME_FORMAT as DF

from odoo.addons.base.tests.common import BaseCommon


class TestHrAttendanceReason(BaseCommon):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.att_reason_model = cls.env["hr.attendance.reason"]
        cls.user = new_test_user(
            cls.env,
            login="test-user",
            groups="base.group_user,hr_attendance.group_hr_attendance_own_reader",
        )
        cls.employee = cls.env["hr.employee"].create(
            {"name": cls.user.login, "user_id": cls.user.id}
        )
        cls.att_reason_in = cls.att_reason_model.create(
            {"name": "Bus did not come", "code": "BB", "action_type": "sign_in"}
        )
        cls.att_reason_out = cls.att_reason_model.create(
            {"name": "A lot of work", "code": "WORK", "action_type": "sign_out"}
        )

    @users("test-user")
    def test_employee_edit(self):
        self.env["hr.attendance"].sudo().create(
            {
                "employee_id": self.env.user.employee_id.id,
                "check_in": datetime.now().strftime(DF),
                "attendance_reason_ids": [(4, self.att_reason_in.id)],
            }
        )
        # check out
        attendance = self.env.user.employee_id.with_context(
            attendance_reason_id=self.att_reason_out.id
        )._attendance_action_change({})
        self.assertIn(self.att_reason_in, attendance.attendance_reason_ids)
        self.assertIn(self.att_reason_out, attendance.attendance_reason_ids)

    @users("test-user")
    def test_user_attendance_manual(self):
        # check in
        attendance = self.env.user.employee_id.with_context(
            attendance_reason_id=self.att_reason_in.id
        )._attendance_action_change({})
        self.assertIn(self.att_reason_in, attendance.attendance_reason_ids)
        # check out
        attendance = self.env.user.employee_id.with_context(
            attendance_reason_id=self.att_reason_out.id
        )._attendance_action_change({})
        self.assertIn(self.att_reason_out, attendance.attendance_reason_ids)

    @freeze_time("2025-01-01 20:00:00")
    def test_cron_auto_check_out(self):
        attendance = (
            self.env["hr.attendance"]
            .sudo()
            .create(
                {
                    "employee_id": self.user.employee_id.id,
                    "check_in": "2025-01-01 01:00:00",
                    "attendance_reason_ids": [(4, self.att_reason_in.id)],
                }
            )
        )
        self.env.company.auto_check_out = True
        self.env.company.auto_check_out_tolerance = 1
        out_reason = self.env.ref("hr_attendance_reason.hr_attendance_reason_check_out")
        self.env.company.auto_check_out_reason_id = out_reason
        self.env["hr.attendance"]._cron_auto_check_out()
        self.assertTrue(attendance.check_out)
        self.assertEqual(attendance.out_mode, "auto_check_out")
        self.assertIn(out_reason, attendance.attendance_reason_ids)
