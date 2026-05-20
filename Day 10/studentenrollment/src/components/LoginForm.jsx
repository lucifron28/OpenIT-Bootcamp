function LoginForm() {
    return (
        <>
            <h2>Login</h2>
            <form>
                <input type="text" id="email" placeholder="Enter your email" />
                <label htmlFor="email">Email</label>
                <input type="password" id="password" placeholder="Enter your password" />
                <label htmlFor="password">Password</label>
                <button type="submit">Login</button>
                <p><a href="/register">Create an account</a></p>
            </form>
        </>
    )
}