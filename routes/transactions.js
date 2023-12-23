const {
  signUp,
  userVerifyToken,
  userVerify,
  login,
  logout,
  currentUser,
  uploadAvatars,
} = require("../controllers/auth");

const {
  addExpense,
  getExpenses,
  deleteExpense,
} = require("../controllers/expense");

const {
  addIncome,
  getIncomes,
  deleteIncome,
} = require("../controllers/income");

const { authorize } = require("../middlwares");

const router = require("express").Router();

router
  .post("/users/signup", signUp)
  .get("/users/verify/:verificationToken", userVerifyToken)
  .post("/users/verify", userVerify)
  .post("/users/login", login)
  .get("/users/logout", authorize, logout)
  .get("/users/current", authorize, currentUser)
  .patch("/users/avatars", authorize, uploadAvatars)

  .post("/add-income", addIncome)
  .get("/get-incomes", getIncomes)
  .delete("/delete-income/:id", deleteIncome)
  .post("/add-expense", addExpense)
  .get("/get-expenses", getExpenses)
  .delete("/delete-expense/:id", deleteExpense);

// .post(addIncome)
// .get(getIncomes)
// .delete("/:id", deleteIncome)
// .post(addExpense)
// .get(getExpenses)
// .delete("/:id", deleteExpense);

module.exports = router;
