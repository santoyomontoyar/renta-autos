async function verificarSesion() {
    try {
        const res = await fetch("../php/user.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "checkSession" })
        });
        const json = await res.json();

        if (json.status !== "success") {
            window.location.href = "/";
            return;
        }

        const usuario = json.data;
        const modulosPermitidos = window.MODULOS_POR_ROL[usuario.rol] ?? [];
        const moduloActual = window.location.pathname.split("/").filter(Boolean)[0] ?? "";

        if (!modulosPermitidos.includes(moduloActual)) {
            window.location.href = "/" + (window.HOME_POR_ROL[usuario.rol] ?? "");
            return;
        }

        window.currentUser = usuario;
        document.dispatchEvent(new CustomEvent("sesionLista"));
    } catch (err) {
        console.error("Error verificando sesión:", err);
        window.location.href = "/";
    }
}
verificarSesion();