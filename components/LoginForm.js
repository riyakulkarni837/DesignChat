import Link from "next/link";

export default function LoginForm(errorMessage, onSubmit) {
  return (
    <div className="login">
      <form onSubmit={errorMessage.onSubmit} className="login-form">
        <div className="login-spacer">
          <label className="login-text">Chat handle</label>
          <input
            className="login-input"
            type="text"
            name="chatHandle"
            required
          />
          {errorMessage.errorMessage && (
            <p className="login-error">{errorMessage.errorMessage}</p>
          )}
        </div>
        <div className="login-buttons">
          <button className="login-submit" type="submit">
            Access Chat
          </button>
          <Link className="login-cancel" href="/">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
