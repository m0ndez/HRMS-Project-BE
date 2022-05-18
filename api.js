const ctr = require("./Controllers/index");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const TokenManager = require("./Services/tokenManager");
const DecryptData = require("./Services/decryptData");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Insatance API Static
app.use("/api", router);
// Static Path For View Image
app.use("/images/employee", express.static("uploads"));

// -------- Multer UploadFile -------- //
const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (request, file, cb) {
    cb(null, uuidv4() + "." + file.originalname.split(".")[1]);
  },
});

const fileFilter = (request, file, cb) => {
  if (["image/jpeg", "image/png"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 6 },
  fileFilter,
});
// -------- Multer UploadFile -------- //

// -------- Setup Middleware -------- //
router.use((requst, response, next) => {
  // ByPass URL
  if (["/login"].includes(requst.url)) {
    next();
  } else {
    let verify = TokenManager.checkAuthentication(requst);
    if (verify !== false) {
      next();
    } else {
      response.status(401).json({
        code: 401,
        message: "โปรดทำการเข้าสู่ระบบ",
      });
    }
  }
});
// -------- Setup Middleware -------- //

router.route("/login").post((request, response) => {
  const { body } = request;
  ctr.AuthController.getLogin({
    ...body,
    password: DecryptData.passwordDecrypt(body.password),
  })
    .then((result) => {
      if (result) {
        if ([true, undefined].includes(result.state)) {
          return response.json({
            code: 200,
            data: { ...result, permission: body.permission },
            message: "",
          });
        } else {
          return response.status(401).json({
            code: 401,
            data: null,
            message: "รหัสผู้ใช้ถูกปิดกรุณาติดต่อผู้ดูแลระบบ",
          });
        }
      } else {
        return response.status(401).json({
          code: 401,
          data: null,
          message: "รหัสผู้ใช้ไม่ถูกต้อง",
        });
      }
    })
    .catch((error) => {
      return response.status(400).json(error);
    });
});

router.route("/login/verify").post((request, response) => {
  const { token } = request.headers;
  const res = TokenManager.checkAuthentication(request);
  response.json({
    token,
    res,
  });
});

router.route("/user/me").get((request, response) => {
  let jwtVerify = TokenManager.checkAuthentication(request);
  ctr.UserController.userMe(jwtVerify)
    .then((result) => {
      if (result) {
        response.json({
          code: 200,
          data: { ...result, permission: jwtVerify.permission },
          message: "",
        });
      } else {
        response.status(401).json({
          code: 401,
          data: null,
          message: "เกิดข้อผิดพลาด",
        });
      }
    })
    .catch((error) => {
      response.status(400).json(error);
    });
});

router.route("/user/:id").put((request, response) => {
  const matching = request.params.id;
  const jwtVerify = TokenManager.checkAuthentication(request);
  const { body } = request;
  if ([matching].includes(jwtVerify.id)) {
    ctr.UserController.editUser(body)
      .then((result) => {
        if (result) {
          response.json({
            code: 200,
            data: { ...result, permission: body.permission },
            message: "",
          });
        } else {
          response.status(400).json({
            code: 400,
            data: null,
            message: "การทำรายการไม่ถูกต้อง",
          });
        }
      })
      .catch((error) => {
        response.status(400).json(error);
      });
  } else {
    response.status(401).json({
      code: 401,
      data: null,
      message: "เกิดข้อผิดพลาด",
    });
  }
});

router.route("/user/:id/passowrd").put((request, response) => {
  const matching = request.params.id;
  const jwtVerify = TokenManager.checkAuthentication(request);
  const passwordCheck = request.body.current_password;
  const decryptPassword = DecryptData.passwordDecrypt(
    request.body.new_password
  );

  if ([matching].includes(jwtVerify.id)) {
    if ([passwordCheck].includes(jwtVerify.password)) {
      const prepareData = {
        id: matching,
        permission: jwtVerify.permission,
        new_password: decryptPassword,
      };
      // console.log('prepareData', prepareData)
      ctr.UserController.changeUserPassword(prepareData)
        .then((result) => {
          if (result) {
            response.json({
              code: 200,
              data: { ...result, permission: jwtVerify.permission },
              message: "",
            });
          } else {
            response.status(400).json({
              code: 400,
              data: null,
              message: "การทำรายการไม่ถูกต้อง",
            });
          }
        })
        .catch((error) => {
          response.status(400).json(error);
        });
    } else {
      return response.status(401).json({
        code: 401,
        data: null,
        message: "รหัสผ่านไม่ถูกต้อง",
      });
    }
  } else {
    return response.status(400).json({
      code: 400,
      data: null,
      message: "เกิดข้อผิดพลาด",
    });
  }
});

router.route("/timesheet").get((request, response) => {
  const jwtVerify = TokenManager.checkAuthentication(request);

  const createRequest = {
    ...request.query,
    id: jwtVerify.id,
    permission: jwtVerify.permission,
  };
  ctr.TimesheetController.getTimesheet(createRequest)
    .then((result) => {
      if (result) {
        return response.json({
          code: 200,
          data: result,
          message: "",
        });
      } else {
        return response.status(400).json({
          code: 400,
          data: error,
          message: "การทำรายการไม่ถูกต้อง",
        });
      }
    })
    .catch((error) => {
      return response.status(400).json({
        code: 400,
        data: error,
        message: "การทำรายการไม่ถูกต้อง",
      });
    });
});

router.route("/timesheet").post((request, response) => {
  const jwtVerify = TokenManager.checkAuthentication(request);
  const createRequest = {
    ...request.body,
    work_created_by: jwtVerify.id,
  };
  ctr.TimesheetController.createTimesheet(createRequest)
    .then((result) => {
      if (result) {
        return response.json({
          code: 200,
          data: { work_id: result.work_id },
          message: `สร้างเอกสารเลขที่ ${result.work_id} สำเร็จ`,
        });
      } else {
        return response.status(400).json({
          code: 400,
          data: error,
          message: "การทำรายการไม่ถูกต้อง",
        });
      }
    })
    .catch((error) => {
      return response.status(400).json({
        code: 400,
        data: error,
        message: "การทำรายการไม่ถูกต้อง",
      });
    });
});

router.route("/timesheet/:id").put((request, response) => {
  const createRequest = {
    ...request.body,
    work_id: request.params.id,
  };
  ctr.TimesheetController.updateTimesheet(createRequest)
    .then((result) => {
      if (result) {
        return response.json({
          code: 200,
          data: null,
          message: `แก้ไขเอกสาร ${request.params.id} เสร็จสมบูรณ์`,
        });
      } else {
        return response.status(400).json({
          code: 400,
          data: error,
          message: "การทำรายการไม่ถูกต้อง",
        });
      }
    })
    .catch((error) => {
      return response.status(400).json({
        code: 400,
        data: error,
        message: "การทำรายการไม่ถูกต้อง",
      });
    });
});

router.route("/timesheet/:id").get((request, response) => {
  ctr.TimesheetController.getTimesheetByid(request.params.id)
    .then((result) => {
      if (result) {
        return response.json({
          code: 200,
          data: result,
          message: "",
        });
      } else {
        return response.status(400).json({
          code: 400,
          data: error,
          message: "การทำรายการไม่ถูกต้อง",
        });
      }
    })
    .catch((error) => {
      return response.status(400).json({
        code: 400,
        data: error,
        message: "การทำรายการไม่ถูกต้อง",
      });
    });
});

router.route("/timesheet/:id").delete((request, response) => {
  ctr.TimesheetController.deleteTimesheetByid(request.params.id)
    .then((result) => {
      if (result) {
        return response.json({
          code: 200,
          data: null,
          message: `ลบใบงาน ${request.params.id} เสร็จสมบูรณ์`,
        });
      } else {
        return response.status(400).json({
          code: 400,
          data: error,
          message: "การทำรายการไม่ถูกต้อง",
        });
      }
    })
    .catch((error) => {
      return response.status(400).json({
        code: 400,
        data: error,
        message: "การทำรายการไม่ถูกต้อง",
      });
    });
});

router.route("/leavesheet").post((request, response) => {
  const jwtVerify = TokenManager.checkAuthentication(request);
  const createRequest = {
    ...request.body,
    leave_created_by: jwtVerify.id,
  };
  ctr.LeaveController.createLeavesheet(createRequest)
    .then((result) => {
      if (result) {
        return response.json({
          code: 200,
          data: { leave_id: result.leave_id },
          message: `สร้างเอกสารเลขที่ ${result.leave_id} สำเร็จ`,
        });
      } else {
        return response.status(400).json({
          code: 400,
          data: error,
          message: "การทำรายการไม่ถูกต้อง",
        });
      }
    })
    .catch((error) => {
      return response.status(400).json({
        code: 400,
        data: error,
        message: "การทำรายการไม่ถูกต้อง",
      });
    });
});

router.route("/leavesheet").get((request, response) => {
  const jwtVerify = TokenManager.checkAuthentication(request);

  const createRequest = {
    ...request.query,
    id: jwtVerify.id,
    permission: jwtVerify.permission,
  };
  ctr.LeaveController.getLeavesheet(createRequest)
    .then((result) => {
      if (result) {
        return response.json({
          code: 200,
          data: result,
          message: "",
        });
      } else {
        return response.status(400).json({
          code: 400,
          data: error,
          message: "การทำรายการไม่ถูกต้อง",
        });
      }
    })
    .catch((error) => {
      return response.status(400).json({
        code: 400,
        data: error,
        message: "การทำรายการไม่ถูกต้อง",
      });
    });
});

router.route("/leavesheet/:id").delete((request, response) => {
  ctr.LeaveController.deleteLeavesheet(request.params.id)
    .then((result) => {
      if (result) {
        return response.json({
          code: 200,
          data: null,
          message: `ยกเลิกใบงาน ${request.params.id} เสร็จสมบูรณ์`,
        });
      } else {
        return response.status(400).json({
          code: 400,
          data: error,
          message: "การทำรายการไม่ถูกต้อง",
        });
      }
    })
    .catch((error) => {
      return response.status(400).json({
        code: 400,
        data: error,
        message: "การทำรายการไม่ถูกต้อง",
      });
    });
});

const port = process.env.PORT || 5000;
app.listen(port);
console.log("Api is running at " + port);
