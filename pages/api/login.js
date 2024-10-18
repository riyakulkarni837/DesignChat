import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";

async function loginRoute(req, res) {
  const names = process.env.ALLOWED_USERS;
  console.log(names);

  const { chatHandle } = await req.body;

  try {
    if (names.includes(chatHandle)) {
      const user = { isLoggedIn: true, chatHandle: chatHandle };
      req.session.user = user;
      await req.session.save();
      res.json(user);
    } else {
      res.status(200).json({ message: "Chat handle does not exist" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
