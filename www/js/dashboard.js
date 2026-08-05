// Dashboard con gráficas de ApexCharts, solo con datos de mis módulos:
// modelo_vehiculo, reporte_falla, imagen_falla, imagen_modelo_vehiculo

async function cargarStats() {
    const res = await fetch("../php/dashboard.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getStats" })
    });
    const json = await res.json();
    if (json.status !== "success") return;

    const s = json.data;

    renderFallasPorMes(s.fallas_por_mes);
    renderModelosPorCategoria(s.modelos_por_categoria);
    renderTopMecanicos(s.top_mecanicos);
    renderImagenesTipo(s.imagenes_por_tipo);
    renderFallasEvidencia(s.fallas_con_evidencia);
}

function renderFallasPorMes(datos) {
    new ApexCharts(document.querySelector("#chartFallasPorMes"), {
        chart: { type: "area", height: 280, toolbar: { show: false } },
        series: [{ name: "Fallas", data: datos.map(d => d.total) }],
        xaxis: { categories: datos.map(d => d.mes) },
        colors: ["#6366f1"],
        stroke: { curve: "smooth" },
        dataLabels: { enabled: false }
    }).render();
}

function renderModelosPorCategoria(datos) {
    new ApexCharts(document.querySelector("#chartModelosCategoria"), {
        chart: { type: "donut", height: 280 },
        series: datos.map(d => d.total),
        labels: datos.map(d => d.categoria),
        legend: { position: "bottom" }
    }).render();
}

function renderTopMecanicos(datos) {
    new ApexCharts(document.querySelector("#chartTopMecanicos"), {
        chart: { type: "bar", height: 280, toolbar: { show: false } },
        series: [{ name: "Reportes", data: datos.map(d => d.total) }],
        xaxis: { categories: datos.map(d => d.mecanico) },
        colors: ["#f59e0b"],
        plotOptions: { bar: { borderRadius: 6, horizontal: true } },
        dataLabels: { enabled: false }
    }).render();
}

function renderImagenesTipo(datos) {
    new ApexCharts(document.querySelector("#chartImagenesTipo"), {
        chart: { type: "pie", height: 280 },
        series: [datos.principales, datos.galeria],
        labels: ["Principal / Portada", "Galería"],
        colors: ["#22c55e", "#94a3b8"],
        legend: { position: "bottom" }
    }).render();
}

function renderFallasEvidencia(datos) {
    new ApexCharts(document.querySelector("#chartFallasEvidencia"), {
        chart: { type: "bar", height: 220, toolbar: { show: false } },
        series: [{ name: "Fallas", data: [datos.con_evidencia, datos.sin_evidencia] }],
        xaxis: { categories: ["Con foto de evidencia", "Sin foto de evidencia"] },
        colors: ["#0ea5e9"],
        plotOptions: { bar: { borderRadius: 6, columnWidth: "40%" } },
        dataLabels: { enabled: true }
    }).render();
}

cargarStats();