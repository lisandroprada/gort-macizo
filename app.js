(function () {
  var C = window.CONFIG, G = window.GEO;
  var fmt = new Intl.NumberFormat("es-AR");
  var msg = "Hola, consulto por los macizos de Rawson (parcelas 21 y 20).";

  var tbody = document.getElementById("frac");
  C.fracciones.forEach(function (f) {
    var tr = document.createElement("tr");
    var valor = f.usd ? "USD " + fmt.format(f.usd) : "Consultar";
    tr.innerHTML = "<td>" + f.nombre + "</td><td>" + f.origen + "</td><td>" +
      fmt.format(f.m2) + " m² (" + (f.m2 / 10000).toFixed(2).replace(".", ",") + " ha)</td><td>" + valor + "</td>";
    tbody.appendChild(tr);
  });

  var gal = document.getElementById("gallery"), dlg = document.getElementById("viewer");
  C.fotos.forEach(function (p, n) {
    var li = document.createElement("li");
    li.innerHTML = '<button type="button" data-i="' + n + '"><img src="assets/fotos/' + p.f + '-t.jpg" alt="' + p.t + '" loading="lazy" width="800" height="600"><span>' + p.t + "</span></button>";
    gal.appendChild(li);
  });
  gal.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    var p = C.fotos[b.dataset.i];
    dlg.querySelector("img").src = "assets/fotos/" + p.f + ".jpg";
    dlg.querySelector("img").alt = p.t;
    dlg.querySelector("p").textContent = p.t;
    dlg.showModal();
  });
  dlg.addEventListener("click", function (e) { if (e.target === dlg || e.target.classList.contains("close")) dlg.close(); });

  var wa = document.getElementById("wa");
  if (C.whatsapp) wa.href = "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(msg);
  else wa.style.display = "none";
  document.getElementById("mail").href = "mailto:" + C.email + "?subject=" +
    encodeURIComponent("Consulta macizos Rawson") + "&body=" + encodeURIComponent(msg);

  // En celular el mapa no captura el desplazamiento de la página.
  var map = L.map("map", { scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false });
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19, attribution: "Imagery © Esri"
  }).addTo(map);
  var p21 = L.polygon(G.p21, { color: "#29aae2", weight: 3, fillOpacity: .12, className: "draw fill" }).addTo(map).bindTooltip("Parcela 21 · 55.657 m²");
  var p20 = L.polygon(G.p20, { color: "#ffffff", weight: 3, fillOpacity: .12, className: "draw fill" }).addTo(map).bindTooltip("Parcela 20 · 42.851 m²");
  L.polygon(G.bajo, { color: "#e53935", weight: 2, fillOpacity: .35 }).addTo(map).bindTooltip("Zona baja");
  map.fitBounds(L.featureGroup([p21, p20]).getBounds(), { padding: [20, 20] });
  [p21, p20].forEach(function (p) { p.getElement().setAttribute("pathLength", "1"); });

  // Revelado al entrar en pantalla, escalonado dentro de cada grupo.
  var items = document.querySelectorAll("main section:not(.hero) h2, main section:not(.hero) .sub, .sheet>div, .plano, .pano, .gallery li, .table-wrap, .note, .contact .cta");
  if ("IntersectionObserver" in window && document.documentElement.classList.contains("js")) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: .15, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (el, n) {
      el.setAttribute("data-reveal", "");
      if (el.parentElement.classList.contains("sheet")) el.style.setProperty("--i", Array.prototype.indexOf.call(el.parentElement.children, el));
      io.observe(el);
    });
  }

  var c = p21.getBounds().getCenter();
  document.getElementById("gmaps").href = "https://www.google.com/maps/search/?api=1&query=" + c.lat + "," + c.lng;
})();
