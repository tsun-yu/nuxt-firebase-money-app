export default defineEventHandler(async (event) => {
    const { email, password } = await readCredentials(event);

    const { idToken } = await identityToolkit("signUp", email, password);

    const sessionCookie = await adminAuth().createSessionCookie(idToken, {
        expiresIn: SESSION_MAX_AGE_MS,
    });
    setSessionCookie(event, sessionCookie);

    return { ok: true };
});
