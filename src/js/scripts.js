
function decodeJWT(token) {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null; const payload = parts[1];
    // Base64URL decode
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));

    try {
        return JSON.parse(decodedPayload);
    } catch (e) {
        console.error("Invalid JWT payload:", e); return null;
    }
}

function getUserId() {
    const token = localStorage.getItem("token");
    if (!token)
        window.location.href = "../../public/login.html";
    const decoded = decodeJWT(token);
    return decoded.userid;
}

function getUserName() {
    const token = localStorage.getItem("token");
    if (!token)
        window.location.href = "../../login.html";
    const decoded = decodeJWT(token);
    return decoded.sub;
}

function getUserEmail() {
    const token = localStorage.getItem("token");
    if (!token)
        window.location.href = "../../public/login.html";
    const decoded = decodeJWT(token);
    return decoded.email;
}

function getUserType() {
    const token = localStorage.getItem("token");
    if (!token)
        window.location.href = "../../public/login.html";
    const decoded = decodeJWT(token);
    return decoded.usertype;
}

function getAuthorization() {
    const token = localStorage.getItem("token");
    if (!token)
        window.location.href = "../../public/login.html";
    const decoded = decodeJWT(token);
    console.log(`Bearer ${token}`);
    return `Bearer ${token}`;
}

function logout() {
    localStorage.removeItem("token");
    localStorage.clear();
    window.location.href = "../../public/login.html";
}