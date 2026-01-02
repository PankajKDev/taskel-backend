const prisma = require("../utils/db");
const deleteUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "prod",
      sameSite: "strict",
    });

    return res.status(200).send({ message: `successfully deleted the user ` });
  } catch (e) {
    return res.status(400).send({ message: `error deleting user`, error: e });
  }
};

module.exports = { deleteUser };
