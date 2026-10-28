(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var rub = function (n) { return n.toLocaleString("ru-RU").replace(/\s|,/g, "\u00a0") + "\u00a0₽"; };

  // Данные салона (демо)
  var CATS = [
    { id: "nails", t: "Ногти", s: "маникюр, педикюр, дизайн", img: "manicure" },
    { id: "hair", t: "Волосы", s: "стрижки, окрашивание, уход", img: "hair" },
    { id: "brows", t: "Брови и ресницы", s: "архитектура, ламинирование", img: "brows" },
    { id: "face", t: "Уход за лицом", s: "чистки, массаж, пилинги", img: "face" }
  ];
  var LOOKS = [
    ["Нюд-шёлк", "нежный нюд с перламутром"], ["Новый френч", "тонкая линия цветом"], ["Бордо", "глубокий винный глянец"],
    ["Хром", "зеркальная втирка"], ["Абстракция", "яркие линии и цвет"], ["Акцент", "яркий цвет сезона"]
  ];
  var SERVICES = [
    { cat: "nails", t: "Маникюр с покрытием гель-лак", d: "снятие, обработка, покрытие", min: 120, p: 2200 },
    { cat: "nails", t: "Маникюр без покрытия", d: "аппаратный или комбинированный", min: 60, p: 1200 },
    { cat: "nails", t: "Маникюр + дизайн из лукбука", d: "любой дизайн сезона без доплат", min: 150, p: 2900 },
    { cat: "nails", t: "Японский маникюр", d: "укрепление и блеск натуральных ногтей", min: 75, p: 1800 },
    { cat: "nails", t: "Педикюр с покрытием", d: "полный педикюр, гель-лак", min: 120, p: 2500 },
    { cat: "nails", t: "Наращивание ногтей", d: "любая длина и форма", min: 180, p: 3500 },
    { cat: "nails", t: "Дизайн", d: "френч, втирка, рисунок", min: 15, p: 300, from: true },
    { cat: "hair", t: "Женская стрижка", d: "мытьё, стрижка, укладка", min: 60, p: 1800 },
    { cat: "hair", t: "Мужская стрижка", d: "машинка и ножницы", min: 45, p: 1100 },
    { cat: "hair", t: "Окрашивание в один тон", d: "средняя длина", min: 120, p: 3900, from: true },
    { cat: "hair", t: "Сложное окрашивание", d: "AirTouch, балаяж, шатуш", min: 240, p: 7500, from: true },
    { cat: "hair", t: "Укладка", d: "локоны, объём, гладкость", min: 45, p: 1500 },
    { cat: "hair", t: "Уход-восстановление", d: "кератин или ботокс для волос", min: 90, p: 3500, from: true },
    { cat: "brows", t: "Архитектура бровей", d: "форма, коррекция, окрашивание", min: 45, p: 1300 },
    { cat: "brows", t: "Долговременная укладка бровей", d: "с окрашиванием и уходом", min: 60, p: 2000 },
    { cat: "brows", t: "Ламинирование ресниц", d: "с окрашиванием", min: 60, p: 2200 },
    { cat: "brows", t: "Наращивание ресниц", d: "классика, 2D, 3D", min: 150, p: 2800, from: true },
    { cat: "face", t: "Чистка лица", d: "комбинированная с уходом", min: 90, p: 3200 },
    { cat: "face", t: "Уходовая программа", d: "под тип кожи, с массажем", min: 60, p: 2600 },
    { cat: "face", t: "Массаж лица", d: "скульптурный или лимфодренажный", min: 45, p: 2000 },
    { cat: "face", t: "Пилинг", d: "мягкий кислотный, по сезону", min: 45, p: 2400 }
  ];
  var MASTERS = [
    { n: "Алина", r: "Мастер маникюра и педикюра", exp: "7 лет опыта", cats: ["nails"], top: "топ-мастер" },
    { n: "Марина", r: "Колорист, стилист", exp: "9 лет опыта", cats: ["hair"], top: "арт-директор" },
    { n: "Вероника", r: "Бровист, лэшмейкер", exp: "5 лет опыта", cats: ["brows"] },
    { n: "Елена", r: "Косметолог-эстетист", exp: "11 лет опыта", cats: ["face"], top: "мед. образование" }
  ];

  $("#year").textContent = new Date().getFullYear();

  // Мобильное меню
  var burger = $(".burger"), nav = $("#nav");
  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open);
  });
  $$("#nav a").forEach(function (a) { a.addEventListener("click", function () { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", false); }); });

  // Направления (фото-карточки) и прайс
  var cats = $("#cats"), list = $("#priceList");
  function showCat(id) {
    $$(".cat", cats).forEach(function (t) { t.setAttribute("aria-selected", t.dataset.cat === id); });
    list.innerHTML = SERVICES.map(function (s, i) {
      if (s.cat !== id) return "";
      return '<div class="row"><b>' + esc(s.t) + "</b><small>" + esc(s.d) + " · " + s.min + ' мин</small><span class="p">' +
        (s.from ? "от " : "") + rub(s.p) + '<button data-svc="' + i + '">Записаться</button></span></div>';
    }).join("");
  }
  cats.innerHTML = CATS.map(function (c) {
    return '<button class="cat" role="tab" data-cat="' + c.id + '" style="background-image:url(img/' + c.img + '.webp)"><b>' + c.t + "</b><small>" + c.s + "</small></button>";
  }).join("");
  cats.addEventListener("click", function (e) { var t = e.target.closest(".cat"); if (t) showCat(t.dataset.cat); });
  list.addEventListener("click", function (e) { var b = e.target.closest("[data-svc]"); if (b) openBook({ svc: +b.dataset.svc }); });
  showCat("nails");

  // Лукбук: любой дизайн ведёт в запись на «Маникюр + дизайн»
  var lookSvc = SERVICES.findIndex(function (s) { return /лукбук/.test(s.t); });
  $("#looks").innerHTML = LOOKS.map(function (l, i) {
    return '<button class="look" data-look="' + i + '" style="background-image:url(img/look-' + (i + 1) + '.webp)" aria-label="' + l[0] + ', записаться"><span><b>' + l[0] + "</b><small>" + l[1] + "</small></span></button>";
  }).join("");
  $("#looks").addEventListener("click", function (e) { var b = e.target.closest(".look"); if (b) openBook({ svc: lookSvc, look: LOOKS[+b.dataset.look][0] }); });

  // Мастера
  $("#masterGrid").innerHTML = MASTERS.map(function (m, i) {
    return '<article class="master"><div class="master__ph" style="background-image:url(img/master-' + (i + 1) + '.webp)">' + (m.top ? "<em>" + m.top + "</em>" : "") +
      "</div><h3>" + m.n + "</h3><p>" + m.r + " · " + m.exp + '</p><button class="btn btn--ghost" data-master="' + i + '">Записаться к ' + (m.n === "Елена" ? "Елене" : m.n.slice(0, -1) + "е") + "</button></article>";
  }).join("");
  $("#masterGrid").addEventListener("click", function (e) { var b = e.target.closest("[data-master]"); if (b) openBook({ master: +b.dataset.master }); });

  // Подарочный сертификат
  $("#giftOpts").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    $$("button", this).forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
    $("#giftSum").textContent = b.textContent;
  });

  // Онлайн-запись: услуга → мастер → дата и время → контакты
  var modal = $("#book"), body = $("#bookBody"), title = $("#bookTitle"), stepEl = $("#bookStep"), back = $("#bookBack"), sum = $("#bookSum");
  var st, lastFocus;
  var DAYS = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"], MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

  function openBook(pre) {
    st = { step: 1, svc: null, master: null, day: new Date().getHours() >= 19 ? 1 : 0, time: null };
    if (pre && pre.svc != null) { st.svc = pre.svc; st.step = 2; }
    if (pre && pre.master != null) st.master = pre.master;
    if (pre && pre.look) st.look = pre.look;
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("is-locked");
    render();
    $(".modal__x").focus();
  }
  function closeBook() {
    modal.hidden = true;
    document.body.classList.remove("is-locked");
    if (lastFocus) lastFocus.focus();
  }
  function mastersFor(svc) { return MASTERS.filter(function (m) { return m.cats.indexOf(SERVICES[svc].cat) >= 0; }); }
  function dateOf(offset) { var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + offset); return d; }
  // Занятость псевдослучайная, но стабильная для мастера и дня
  function busy(day, slot) { var x = Math.sin((st.master + 1) * 97 + day * 31 + slot * 7) * 10000; return x - Math.floor(x) < 0.35; }

  function render() {
    stepEl.textContent = st.step <= 4 ? "Шаг " + st.step + " из 4" : "Готово";
    back.hidden = st.step === 1 || st.step === 5;
    var s = st.svc != null ? SERVICES[st.svc] : null;
    sum.textContent = s && st.step < 5 ? s.t + (st.master != null && st.step > 2 ? " · " + MASTERS[st.master].n : "") : "";
    var h = "";
    if (st.step === 1) {
      title.textContent = "Выберите услугу";
      var allowed = st.master != null ? MASTERS[st.master].cats : null;
      CATS.forEach(function (c) {
        if (allowed && allowed.indexOf(c.id) < 0) return;
        h += '<p class="eyebrow" style="margin:10px 0 2px">' + c.t + "</p>";
        SERVICES.forEach(function (x, i) {
          if (x.cat === c.id) h += '<button class="opt" data-pick="svc" data-v="' + i + '"><span>' + esc(x.t) + "</span><small>" + (x.from ? "от " : "") + rub(x.p) + "</small></button>";
        });
      });
    } else if (st.step === 2) {
      title.textContent = "Выберите мастера";
      mastersFor(st.svc).forEach(function (m) {
        var mi = MASTERS.indexOf(m);
        h += '<button class="opt" data-pick="master" data-v="' + mi + '"><span class="opt__who"><span class="opt__ava" style="background-image:url(img/master-' + (mi + 1) + '.webp)"></span><span><b>' + m.n + "</b><br><small>" + m.r + "</small></span></span><small>" + m.exp + "</small></button>";
      });
    } else if (st.step === 3) {
      title.textContent = "Дата и время";
      h += '<div class="days">';
      for (var i = 0; i < 14; i++) {
        var d = dateOf(i);
        h += '<button class="day" data-day="' + i + '" aria-pressed="' + (i === st.day) + '">' + (i === 0 ? "сегодня" : DAYS[d.getDay()]) + "<b>" + d.getDate() + "</b></button>";
      }
      h += '</div><div class="times">';
      var now = new Date(), slot = 0;
      for (var t = 9 * 60; t <= 19 * 60; t += 60, slot++) {
        var label = Math.floor(t / 60) + ":00";
        var past = st.day === 0 && t <= now.getHours() * 60 + now.getMinutes();
        h += '<button class="time" data-time="' + label + '"' + (past || busy(st.day, slot) ? " disabled" : "") + ">" + label + "</button>";
      }
      h += "</div>";
    } else if (st.step === 4) {
      title.textContent = "Ваши контакты";
      var dd = dateOf(st.day);
      h += '<p style="margin-bottom:6px"><b>' + esc(s.t) + (st.look ? " «" + st.look + "»" : "") + "</b><br>" + MASTERS[st.master].n + " · " + dd.getDate() + " " + MONTHS[dd.getMonth()] + ", " + st.time + "</p>" +
        '<form class="fields" id="bookForm"><label>Имя<input type="text" name="n" required autocomplete="name"></label>' +
        '<label>Телефон<input type="tel" name="p" required autocomplete="tel" placeholder="+7"></label>' +
        '<label class="check"><input type="checkbox" name="first"> Я у вас впервые (−20%)</label>' +
        '<button class="btn" type="submit">Записаться</button></form>';
    } else {
      var d5 = dateOf(st.day), price = s.p * (st.first ? 0.8 : 1);
      title.textContent = "Вы записаны";
      h = '<div class="done"><i>✓</i><p><b style="color:var(--ink)">' + esc(st.name) + ", ждём вас " + d5.getDate() + " " + MONTHS[d5.getMonth()] + " в " + st.time + "</b><br>" +
        esc(s.t) + (st.look ? " «" + st.look + "»" : "") + ", мастер " + MASTERS[st.master].n + ". Стоимость " + (s.from ? "от " : "") + rub(Math.round(price)) + (st.first ? " с учётом скидки 20%" : "") +
        ".<br>Напомним о визите накануне.</p><p style=\"margin-top:14px;font-size:13px\">Это демо: запись никуда не отправляется.</p>" +
        '<button class="btn" data-close style="margin-top:20px">Хорошо</button></div>';
    }
    body.innerHTML = h;
  }

  body.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.pick === "svc") {
      st.svc = +b.dataset.v;
      if (st.master != null && mastersFor(st.svc).indexOf(MASTERS[st.master]) < 0) st.master = null;
      st.step = st.master != null ? 3 : 2;
    } else if (b.dataset.pick === "master") { st.master = +b.dataset.v; st.step = 3; }
    else if (b.dataset.day) { st.day = +b.dataset.day; }
    else if (b.dataset.time) { st.time = b.dataset.time; st.step = 4; }
    else return;
    render();
  });
  body.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    st.name = f.n.value.trim(); st.first = f.first.checked; st.step = 5;
    render();
  });
  back.addEventListener("click", function () {
    st.step -= 1;
    render();
  });
  modal.addEventListener("click", function (e) { if (e.target === modal || e.target.closest("[data-close]")) closeBook(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) closeBook(); });
  $$("[data-book]").forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); openBook(); }); });

  // Переключатель палитры
  var root = document.documentElement, toggle = $(".pal__toggle"), palList = $("#palList");
  var mark = function () { $$("button", palList).forEach(function (b) { b.classList.toggle("is-on", b.dataset.p === root.dataset.palette); }); };
  toggle.addEventListener("click", function () { palList.hidden = !palList.hidden; toggle.setAttribute("aria-expanded", !palList.hidden); });
  $$("button", palList).forEach(function (b) {
    b.addEventListener("click", function () {
      root.setAttribute("data-palette", b.dataset.p);
      try { localStorage.setItem("silk-palette", b.dataset.p); } catch (e) {}
      mark();
    });
  });
  mark();
})();
