function RegisterForm() {
    return (
        <>
            <h2>Register</h2>
            <form action="">
                <input type="email" id="email" placeholder="Enter your email" />
                <label htmlFor="email">Email</label>
                <input type="password" id="password" placeholder="Enter your password"/>
                <label htmlFor="password">Password</label>
                <input type="password" id="confirm-password" placeholder="Confirm your password"/>
                <label htmlFor="confirm-password">Confirm Password</label>
                <button type="submit">Register</button>
                <p><a href="/login">Already have an account? Login</a></p>
            </form>
        </>
    )
}