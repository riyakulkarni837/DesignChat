import { sessionOptions } from "../../lib/session";
import { withIronSessionApiRoute } from "iron-session/next";

async function userRoute(req, res) {
  if (req.session.user) {
    res.json({
      ...req.session.user,
      isLoggedIn: true,
    });
  } else {
    res.json({
      isLoggedIn: false,
      chatHandle: "",
    });
  }
}

export default withIronSessionApiRoute(userRoute, sessionOptions);
