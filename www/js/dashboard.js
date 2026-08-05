async function cargarStats() {
    try {
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
        renderVentasPorDia(s.ventas_por_dia);
        renderVentasResumen(s.ventas_resumen_mes);
    } catch (err) {
        console.error("Error al cargar estadísticas:", err);
    }
}

function renderVentasResumen(datos) {
    document.querySelector("#kpiVentasEsteMes").textContent = `$${datos.ventas_este_mes.toFixed(2)}`;
    document.querySelector("#kpiVentasMesPasado").textContent = `$${datos.ventas_mes_pasado.toFixed(2)}`;
}

function renderVentasPorDia(datos) {
    new ApexCharts(document.querySelector("#chartVentasPorDia"), {
        chart: { type: "area", height: 280, toolbar: { show: false } },
        series: [{ name: "Ventas", data: datos.map(d => d.total) }],
        xaxis: { categories: datos.map(d => d.dia) },
        colors: ["#22c55e"],
        stroke: { curve: "smooth" },
        dataLabels: { enabled: false },
        yaxis: { labels: { formatter: v => `$${v.toFixed(0)}` } }
    }).render();
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

async function cargarFallasDelMes(mes) {
    try {
        const res = await fetch("../php/dashboard.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "getFallasPorMesFiltro", mes })
        });
        const json = await res.json();
        if (json.status !== "success") return;

        document.querySelector("#kpiFallasMes").textContent = json.data.total;
    } catch (err) {
        console.error("Error al filtrar fallas por mes:", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const mesFallas = document.querySelector("#mesFallas");
    mesFallas.value = new Date().toISOString().slice(0, 7); // YYYY-MM, mes actual por defecto

    mesFallas.addEventListener("change", () => {
        cargarFallasDelMes(mesFallas.value);
    });

    cargarStats();
    cargarFallasDelMes(mesFallas.value);
});