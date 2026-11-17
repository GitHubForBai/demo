(function () {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------------- toast ---------------- */
  let toastTimer = null;
  function toast(html, actions = [], ms = 4200) {
    const el = $("#toast");
    el.innerHTML = `<span>${html}</span>`;
    actions.forEach((a) => {
      const b = document.createElement("button");
      b.className = "btn sm " + (a.primary ? "red" : "");
      b.textContent = a.label;
      b.onclick = () => { hideToast(); a.onClick && a.onClick(); };
      el.appendChild(b);
    });
    el.classList.add("show");
    clearTimeout(toastTimer);
    if (ms) toastTimer = setTimeout(hideToast, ms);
  }
  function hideToast() { $("#toast").classList.remove("show"); }

  /* ---------------- doc nav ---------------- */
  const sidebar = $("#sidebar");
  $("#menuBtn").addEventListener("click", () => sidebar.classList.toggle("open"));
  $$("#sidebar a").forEach((a) => a.addEventListener("click", () => sidebar.classList.remove("open")));
  const navLinks = $$("#sidebar a");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  $$("main section.block").forEach((s) => io.observe(s));

  /* ---------------- pinyin helpers ---------------- */
  const TONE_MARKS = { 1: "āēīōūǖĀĒĪŌŪǕ", 2: "áéíóúǘÁÉÍÓÚǗ", 3: "ǎěǐǒǔǚǍĚǏǑǓǙ", 4: "àèìòùǜÀÈÌÒÙǛ" };
  function toneOf(syl) {
    for (const t of [1, 2, 3, 4]) for (const ch of TONE_MARKS[t]) if (syl.includes(ch)) return t;
    return 0;
  }
  function colorPy(py, sep = "") {
    return py.split(/\s+/).filter(Boolean).map((s) => {
      const lead = s.match(/^[^a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]*/)[0];
      const core = s.slice(lead.length);
      return `${esc(lead)}<span class="t${toneOf(core)}">${esc(core)}</span>`;
    }).join(sep);
  }

  /* ---------------- prototype navigation ---------------- */
  const SCREEN_URL = {
    home: "teacher/home", gen: "teacher/lessons/new", lib: "teacher/library", level: "teacher/tools/leveling",
    game: "classroom/games", report: "teacher/classes/c2/report", memory: "teacher/memory",
    tone: "student/practice/speaking", write: "student/practice/writing",
  };
  const screenInit = {};
  function showScreen(id) {
    $$("#protoNav button").forEach((b) => b.classList.toggle("active", b.dataset.screen === id));
    $$(".screen").forEach((s) => s.classList.toggle("active", s.id === "screen-" + id));
    $("#protoUrl").textContent = "app.hanassist.cn/" + SCREEN_URL[id];
    if (screenInit[id]) { screenInit[id](); screenInit[id] = null; }
  }
  $$("#protoNav button").forEach((b) => b.addEventListener("click", () => showScreen(b.dataset.screen)));
  $$("[data-goto]").forEach((b) => b.addEventListener("click", () => showScreen(b.dataset.goto)));

  /* ================================================================
     Memory center (shared state)
     ================================================================ */
  const memories = [
    { id: 1, type: "档案", text: "初级 2 班：36 名泰国中学生，16 岁左右，使用示例初级综合教材，当前进度第 8 课。", src: "你在建班时填写", on: true },
    { id: 2, type: "档案", text: "讲解语言：初级 2 班用泰语 + 中文，初级 3 班用英语 + 中文。", src: "你在建班时填写", on: true },
    { id: 3, type: "偏好", text: "每节课至少包含 1 个课堂游戏，优先连连看。", src: "从 9 月以来 6 次课件编辑中提取，你已确认", on: true },
    { id: 4, type: "偏好", text: "初级班拼音默认显示，二级以上默认隐藏。", src: "10 月 8 日你在设置中修改", on: true },
    { id: 5, type: "情节", text: "初级 2 班高频错误：三声发成二声（41%）；“爱”字笔顺第 6 笔起错（38%）。", src: "第 7–8 课作业自动汇总", on: true },
    { id: 6, type: "回避", text: "点餐话题中不使用猪肉相关的例句（班上有穆斯林学生）。", src: "你在 10 月 20 日手动添加", on: true },
    { id: 7, type: "偏好", text: "练习环节偏好小组活动，而不是个人替换练习。", src: "从最近 3 次课件编辑中提取，等待你确认", on: true, pending: true },
  ];
  const TYPE_CHIP = { "档案": "blue", "偏好": "gold", "情节": "jade", "回避": "red" };
  function renderMemories(flashId) {
    const el = $("#memList");
    if (!memories.length) { el.innerHTML = `<div class="empty">还没有任何记忆。你在建班、修改课件或设置偏好时，系统会在这里记录，并且每条都会先征得你的同意。</div>`; return; }
    el.innerHTML = memories.map((m) => `
      <div class="mem ${m.on ? "" : "off"} ${m.id === flashId ? "new" : ""}" data-id="${m.id}">
        <span class="chip ${TYPE_CHIP[m.type] || ""} mtype">${m.type}</span>
        <div class="mbody"><div class="mtext">${esc(m.text)}</div><div class="msrc">来源：${esc(m.src)}</div></div>
        <div class="row" style="gap:6px;flex-wrap:nowrap">
          ${m.pending ? `<button class="btn sm red" data-act="confirm">确认记住</button><button class="btn sm" data-act="del">不用</button>` :
          `<button class="btn sm" data-act="edit">编辑</button><button class="btn sm" data-act="toggle">${m.on ? "停用" : "启用"}</button><button class="btn sm" data-act="del">删除</button>`}
        </div>
      </div>`).join("");
    const active = memories.filter((m) => m.on && !m.pending).length;
    $("#genMemHint").textContent = `已应用 ${active} 条记忆`;
  }
  $("#memList").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;
    const row = btn.closest(".mem");
    const m = memories.find((x) => x.id === +row.dataset.id);
    const act = btn.dataset.act;
    if (act === "toggle") { m.on = !m.on; renderMemories(); }
    else if (act === "del") { memories.splice(memories.indexOf(m), 1); renderMemories(); toast("已删除这条记忆，之后生成内容时不会再使用。"); }
    else if (act === "confirm") { m.pending = false; m.src = m.src.replace("等待你确认", "你已确认"); renderMemories(m.id); toast("已记住。下次生成课件时，练习环节会默认设计成小组活动。"); }
    else if (act === "edit") {
      const t = row.querySelector(".mtext");
      if (t.isContentEditable) {
        m.text = t.textContent.trim(); t.contentEditable = "false"; btn.textContent = "编辑"; m.src = "你手动编辑"; renderMemories(m.id);
      } else {
        t.contentEditable = "true"; t.focus(); btn.textContent = "保存";
        t.style.outline = "1px dashed var(--gold)"; t.style.padding = "2px 4px"; t.style.borderRadius = "6px";
      }
    }
  });
  function addMemory(type, text, src) {
    const id = Math.max(0, ...memories.map((m) => m.id)) + 1;
    memories.unshift({ id, type, text, src, on: true });
    renderMemories(id);
  }
  renderMemories();

  /* ================================================================
     Courseware generator
     ================================================================ */
  const TOPICS = {
    shop: {
      title: "在商店买衣服", lesson: "第 8 课",
      vocab: [
        ["衣服", "yī fu", "n.", "clothes", 1], ["件", "jiàn", "m.", "measure word for clothes", 1],
        ["多少", "duō shao", "pron.", "how much", 1], ["钱", "qián", "n.", "money", 1],
        ["块", "kuài", "m.", "yuan (spoken)", 1], ["贵", "guì", "adj.", "expensive", 1],
        ["便宜", "pián yi", "adj.", "cheap", 2], ["颜色", "yán sè", "n.", "color", 1],
        ["试", "shì", "v.", "to try", 2], ["合适", "hé shì", "adj.", "suitable; fits", 2],
      ],
      dialogue: [
        ["A", "你好，这件衣服多少钱？", "nǐ hǎo, zhè jiàn yī fu duō shao qián?"],
        ["B", "两百块。", "liǎng bǎi kuài."],
        ["A", "太贵了！可以便宜一点儿吗？", "tài guì le! kě yǐ pián yi yì diǎnr ma?"],
        ["B", "一百八十块，怎么样？", "yì bǎi bā shí kuài, zěn me yàng?"],
        ["A", "好的。我可以试试吗？", "hǎo de. wǒ kě yǐ shì shi ma?"],
        ["B", "当然可以。", "dāng rán kě yǐ."],
      ],
      grammar: ["形容词 + 一点儿", ["便宜一点儿", "大一点儿", "快一点儿"], "表示程度稍微变化，常用于请求。"],
      drill: ["这件衣服多少钱？", ["这本书", "这个手机", "这杯茶"]],
      group: "三人一组：一人当售货员，两人当顾客，用“多少钱 / 太贵了 / 便宜一点儿”完成一次讨价还价，每组 3 分钟后上台表演。",
      rewrite: [["款式", "样子"], ["打折", "便宜一点儿"]],
      sandhi: ["你好 → ní hǎo", "一点儿 → yì diǎnr", "可以 → ké yǐ"],
    },
    food: {
      title: "在饭馆点菜", lesson: "第 9 课",
      vocab: [
        ["饭馆", "fàn guǎn", "n.", "restaurant", 1], ["菜单", "cài dān", "n.", "menu", 2],
        ["服务员", "fú wù yuán", "n.", "waiter", 2], ["点菜", "diǎn cài", "v.", "to order dishes", 2],
        ["米饭", "mǐ fàn", "n.", "rice", 1], ["面条", "miàn tiáo", "n.", "noodles", 2],
        ["喝", "hē", "v.", "to drink", 1], ["茶", "chá", "n.", "tea", 1],
        ["好吃", "hǎo chī", "adj.", "delicious", 1], ["一共", "yí gòng", "adv.", "altogether", 2],
      ],
      dialogue: [
        ["服务员", "您好，这是菜单。", "nín hǎo, zhè shì cài dān."],
        ["A", "我要一碗面条，一杯茶。", "wǒ yào yì wǎn miàn tiáo, yì bēi chá."],
        ["服务员", "好的。还要别的吗？", "hǎo de. hái yào bié de ma?"],
        ["A", "不要了，谢谢。一共多少钱？", "bú yào le, xiè xie. yí gòng duō shao qián?"],
        ["服务员", "三十五块。", "sān shí wǔ kuài."],
      ],
      grammar: ["还要……吗？", ["还要别的吗？", "还要一杯茶吗？", "还要米饭吗？"], "询问是否需要更多，回答：还要…… / 不要了。"],
      drill: ["我要一碗面条。", ["一杯茶", "一碗米饭", "两个包子"]],
      group: "四人一组：一人当服务员，三人点菜，用“我要…… / 还要……吗 / 一共多少钱”完成点菜和结账。",
      rewrite: [["招牌菜", "好吃的菜"], ["买单", "一共多少钱"]],
      sandhi: ["一共 → yí gòng", "一碗 → yì wǎn", "不要 → bú yào"],
    },
    way: {
      title: "去地铁站怎么走", lesson: "第 10 课",
      vocab: [
        ["地铁站", "dì tiě zhàn", "n.", "subway station", 2], ["怎么", "zěn me", "pron.", "how", 1],
        ["走", "zǒu", "v.", "to walk; to go", 1], ["往", "wǎng", "prep.", "towards", 2],
        ["一直", "yì zhí", "adv.", "straight; always", 2], ["左", "zuǒ", "n.", "left", 1],
        ["右", "yòu", "n.", "right", 1], ["远", "yuǎn", "adj.", "far", 1],
        ["离", "lí", "prep.", "from (distance)", 2], ["分钟", "fēn zhōng", "n.", "minute", 1],
      ],
      dialogue: [
        ["A", "请问，地铁站怎么走？", "qǐng wèn, dì tiě zhàn zěn me zǒu?"],
        ["B", "一直往前走，到路口往左走。", "yì zhí wǎng qián zǒu, dào lù kǒu wǎng zuǒ zǒu."],
        ["A", "离这儿远吗？", "lí zhèr yuǎn ma?"],
        ["B", "不远，走五分钟就到了。", "bù yuǎn, zǒu wǔ fēn zhōng jiù dào le."],
        ["A", "谢谢！", "xiè xie!"],
        ["B", "不客气。", "bú kè qi."],
      ],
      grammar: ["A 离 B + 远 / 近", ["学校离地铁站很近", "我家离这儿不远", "饭馆离商店远吗？"], "表示两地之间的距离。"],
      drill: ["往左走。", ["往右", "往前", "一直往前"]],
      group: "两人一组：用教室里画好的“地图”，一人问路，一人指路，完成后交换角色。",
      rewrite: [["十字路口", "路口"], ["步行", "走"]],
      sandhi: ["一直 → yì zhí", "不客气 → bú kè qi", "请问 → qǐng wèn"],
    },
  };
  const CLASS_INFO = {
    th: { name: "初级 2 班 · 泰国中学生", lang: "泰语 + 中文", review: "三声变调（你好、可以）" },
    eu: { name: "初级 3 班 · 欧美成人", lang: "英语 + 中文", review: "zh / ch / sh 与 j / q / x" },
    jk: { name: "中级 1 班 · 日韩大学生", lang: "日语 / 韩语 + 中文", review: "送气音 p / t / k 与 f" },
  };
  let genState = null;

  function slideHTML(s, i) {
    return `<div class="slide ${s.cls || ""} ${s.edited ? "edited" : ""}" data-i="${i}">${s.tag ? `<span class="s-tag chip ${s.tagCls || ""}">${s.tag}</span>` : ""}<div class="s-title">${s.title}</div>${s.body || ""}<span class="s-no">${i + 1}</span></div>`;
  }
  function buildSlides(o) {
    const T = TOPICS[o.topic], C = CLASS_INFO[o.cls];
    const groupPref = memories.some((m) => m.on && !m.pending && m.text.includes("小组活动"));
    const vocabBlock = (items) => `<div class="vocab-mini">${items.map((v) => `<div><span class="hz">${v[0]}</span> <span class="py">${colorPy(v[1])}</span><div class="muted" style="font-size:10px">${v[2]} ${esc(v[3])}${v[4] > 1 ? ` · <b style="color:var(--blue)">${v[4]}级</b>` : ""}</div></div>`).join("")}</div>`;
    const slides = [
      { cls: "cover", title: `${T.lesson}　${T.title}`, body: `<div style="opacity:.9">${C.name} · 初等${["", "一", "二", "三"][o.level]}级 · ${o.minutes}</div><div style="opacity:.75;font-size:10px;margin-top:6px">讲解语言：${C.lang}</div>` },
      { title: "热身与复习", tag: "来自学情", tagCls: "jade", body: `<div>1. 上节课生词快速认读（30 秒）</div><div>2. <b>本班弱项复习</b>：${C.review}</div><div class="muted" style="margin-top:4px;font-size:10px">根据上周作业的错误统计自动加入</div>` },
      { title: "生词（一）", body: vocabBlock(T.vocab.slice(0, 5)) },
      { title: "生词（二）", body: vocabBlock(T.vocab.slice(5)) },
      { title: "课文", body: `<div class="dlg">${T.dialogue.map((d) => `<div><b>${d[0]}：</b>${d[1]}<div class="py muted">${colorPy(d[2], " ")}</div></div>`).join("")}</div>` },
      { title: `语法：${T.grammar[0]}`, body: `<div>${T.grammar[2]}</div><div style="margin-top:6px">${T.grammar[1].map((x) => `<span class="chip" style="margin:2px">${x}</span>`).join("")}</div>` },
      groupPref
        ? { title: "练习：小组角色扮演", tag: "按你的偏好", tagCls: "gold", body: `<div>${T.group}</div>` }
        : { title: "练习：替换练习", body: `<div>${T.drill[0]}</div><div style="margin-top:6px">${T.drill[1].map((x) => `<span class="chip" style="margin:2px">${x}</span>`).join("")}</div>` },
      { title: "课堂游戏：连连看", tag: "H5", tagCls: "blue", body: `<div class="row" style="gap:10px;flex-wrap:nowrap"><div style="width:64px;height:64px;flex:0 0 auto;background:repeating-linear-gradient(45deg,#1d2433 0 4px,#fff 4px 8px);border-radius:6px"></div><div>扫码或点击链接在大屏打开，内容自动取自本课 ${T.vocab.length} 个生词。</div></div>` },
      { title: "小结与作业", body: `<div>1. 跟读课文（AI 纠音）</div><div>2. 书写：${T.vocab.slice(0, 3).map((v) => v[0]).join("、")}（笔顺描红）</div><div>3. 生词复习卡片（每天 5 分钟）</div>` },
    ];
    return slides;
  }
  function renderSlides() {
    $("#slides").innerHTML = `<div class="slides">${genState.slides.map(slideHTML).join("")}</div>`;
    $("#slides").classList.toggle("hide-py", !genState.showPy);
    $$("#slides .py").forEach((p) => (p.style.display = genState.showPy ? "" : "none"));
  }
  $("#slides").addEventListener("click", (e) => {
    const s = e.target.closest(".slide");
    if (!s || !genState) return;
    const z = $("#slideZoom");
    z.innerHTML = slideHTML(genState.slides[+s.dataset.i], +s.dataset.i);
    $$(".py", z).forEach((p) => (p.style.display = genState.showPy ? "" : "none"));
    z.classList.add("show");
  });
  $("#slideZoom").addEventListener("click", () => $("#slideZoom").classList.remove("show"));

  $("#genBtn").addEventListener("click", async () => {
    const o = { cls: $("#gClass").value, level: +$("#gLevel").value, topic: $("#gTopic").value, minutes: $("#gTime").value, src: $("#gSrc").value };
    const T = TOPICS[o.topic];
    const activeMem = memories.filter((m) => m.on && !m.pending).length;
    const above = T.vocab.filter((v) => v[4] > o.level);
    const srcLabel = { mix: "知识库检索 4 份相关教案 + 大模型", kb: "知识库检索 4 份相关教案", llm: "大模型生成" }[o.src];
    const steps = [
      ["装配上下文：班级画像 · 已学 312 词 · 记忆 " + activeMem + " 条", "确定性"],
      ["教学设计：" + o.minutes + " · 8 个环节", "大模型"],
      ["内容生成：" + srcLabel, "大模型"],
      ["分级审校 第 1 轮：超纲 2 处（" + T.rewrite.map((r) => "“" + r[0] + "”").join("、") + "）→ 改写", "确定性"],
      ["分级审校 第 2 轮：0 超纲", "确定性"],
      ["拼音注音、变调 " + T.sandhi.length + " 处 · 内容安全通过", "确定性"],
      ["练习与游戏派生", "大模型"],
      ["渲染 PPTX + H5 + 学生讲义", "确定性"],
    ];
    const btn = $("#genBtn");
    btn.disabled = true; btn.textContent = "生成中…";
    ["#pyToggle", "#editSim", "#exportBtn"].forEach((s) => ($(s).disabled = true));
    $("#levelReport").innerHTML = "";
    $("#slides").innerHTML = `<div class="empty">正在生成，骨架会先出现……</div>`;
    const pipe = $("#pipeline");
    pipe.innerHTML = steps.map((s) => `<div class="pipe-step"><span class="st"></span><span>${s[0]}</span><span class="kind">${s[1]}</span></div>`).join("");
    const els = $$(".pipe-step", pipe);
    for (let i = 0; i < els.length; i++) {
      els[i].classList.add("run");
      await sleep(i === 2 ? 900 : 480);
      els[i].classList.remove("run"); els[i].classList.add("done"); $(".st", els[i]).textContent = "✓";
      if (i === 1) $("#slides").innerHTML = `<div class="slides">${["封面", "热身", "生词", "生词", "课文", "语法", "练习", "游戏", "作业"].map((t, k) => `<div class="slide"><div class="s-title muted">${t}</div><div class="bar" style="margin-top:6px"><i style="width:${30 + k * 7}%;background:#e2dccf"></i></div><span class="s-no">${k + 1}</span></div>`).join("")}</div>`;
    }
    genState = { o, slides: buildSlides(o), showPy: true };
    renderSlides();
    $("#levelReport").innerHTML = `
      <div class="callout jade small" style="margin:0"><b>分级报告</b>
      正文超纲：0<br>
      本课生词 ${T.vocab.length} 个${above.length ? `，其中 ${above.length} 个高于“${["", "一", "二", "三"][o.level]}级”（${above.map((v) => v[0]).join("、")}），作为本课生词教学，已标注` : "，均在等级范围内"}<br>
      语法点 1 个 · 变调：${T.sandhi.join("；")}</div>`;
    btn.disabled = false; btn.textContent = "重新生成";
    ["#pyToggle", "#editSim", "#exportBtn"].forEach((s) => ($(s).disabled = false));
    $("#pyToggle").textContent = "隐藏拼音";
  });
  $("#pyToggle").addEventListener("click", () => {
    if (!genState) return;
    genState.showPy = !genState.showPy;
    $("#pyToggle").textContent = genState.showPy ? "隐藏拼音" : "显示拼音";
    renderSlides();
  });
  $("#editSim").addEventListener("click", () => {
    if (!genState) return;
    const T = TOPICS[genState.o.topic];
    const idx = 6;
    const alreadyGroup = genState.slides[idx].title.includes("小组");
    genState.slides[idx] = alreadyGroup
      ? { title: "练习：小组角色扮演（已修改）", edited: true, body: `<div>${T.group}</div><div class="muted" style="font-size:10px;margin-top:4px">你把表演时间改为每组 5 分钟</div>` }
      : { title: "练习：小组角色扮演（你修改的）", edited: true, body: `<div>${T.group}</div>` };
    renderSlides();
    const pending = memories.find((m) => m.pending);
    const hasPref = memories.some((m) => !m.pending && m.text.includes("小组活动"));
    if (alreadyGroup || hasPref) {
      toast("已保存修改。这一页会在你下次“局部重新生成”时保持不变。");
      return;
    }
    toast("检测到你把“替换练习”改成了“小组角色扮演”。要记住这个偏好吗？", [
      { label: "记住", primary: true, onClick: () => {
        if (pending) { pending.pending = false; pending.src = "从课件编辑中提取，你已确认"; renderMemories(pending.id); }
        else addMemory("偏好", "练习环节偏好小组活动，而不是个人替换练习。", "从课件编辑中提取，你已确认");
        toast("已写入记忆中心。可以在“记忆中心”查看、修改或删除。");
      } },
      { label: "仅这一次" },
    ], 9000);
  });
  $("#exportBtn").addEventListener("click", () => toast("生产版由服务端 python-pptx 按母版渲染出可编辑的 .pptx（拼音为文本框，可隐藏）。此演示页不生成文件。"));

  /* ================================================================
     Resource library
     ================================================================ */
  const RES = [
    { t: "第 8 课 购物 · 完整课件（含连连看）", src: "mine", level: 2, type: "课件", match: 96, tags: ["购物", "多少钱", "一点儿"], color: "#c8432b", lic: "仅自己可见" },
    { t: "买东西情景对话：移动支付版", src: "atom", level: 2, type: "对话", match: 91, tags: ["购物", "手机支付", "时效语料"], color: "#24857a", lic: "平台原创" },
    { t: "“一点儿”和“有点儿”辨析练习 12 题", src: "community", level: 2, type: "练习", match: 88, tags: ["一点儿", "语法"], color: "#2f5fb3", lic: "CC BY-NC · 李老师" },
    { t: "声调二字组 20 组合跟读（含慢速音频）", src: "atom", level: 1, type: "音频", match: 84, tags: ["声调", "变调", "跟读"], color: "#7a4fb3", lic: "平台原创" },
    { t: "把字句教学课件（中级）", src: "community", level: 4, type: "课件", match: 52, tags: ["把字句", "语法"], color: "#2f5fb3", lic: "CC BY-NC · 陈老师" },
    { t: "国际中文智慧教育平台 · 购物主题微课", src: "index", level: 2, type: "视频", match: 79, tags: ["购物", "微课"], color: "#b7862c", lic: "外部链接，跳转原站" },
    { t: "上街买东西（旧版课件，含“粮票”情景）", src: "community", level: 2, type: "课件", match: 61, tags: ["购物"], color: "#8a8f9c", lic: "CC BY · 匿名", old: true },
    { t: "汉字部件卡：衣字旁、贝字旁", src: "atom", level: 2, type: "汉字", match: 73, tags: ["汉字", "部件", "购物"], color: "#c8432b", lic: "平台原创" },
  ];
  const SRC_LABEL = { mine: "我的私有库", community: "社区共享", index: "公共索引", atom: "平台原子资源" };
  let libSrc = "all";
  function renderLib() {
    const q = $("#libQ").value.trim();
    const list = RES.filter((r) => (libSrc === "all" || r.src === libSrc) && (!q || r.t.includes(q) || r.tags.some((t) => t.includes(q) || q.includes(t))))
      .sort((a, b) => b.match - a.match);
    $("#libList").innerHTML = list.length ? list.map((r) => `
      <div class="res"><div class="thumb" style="background:${r.color}">${r.type}</div>
        <div style="flex:1;min-width:0"><b>${esc(r.t)}</b>
          <div class="row" style="gap:6px;margin-top:4px">
            <span class="chip blue">等级 ${r.level} 级</span><span class="chip ${r.match > 80 ? "jade" : ""}">匹配本班 ${r.match}%</span>
            ${r.old ? `<span class="chip gold">语料较旧</span>` : ""}${r.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}
          </div>
          <div class="small muted" style="margin-top:2px">${SRC_LABEL[r.src]} · ${esc(r.lic)}</div></div>
        <div class="stack" style="gap:6px"><button class="btn sm" data-res="use">加入课件</button></div></div>`).join("")
      : `<div class="empty">没有找到“${esc(q)}”相关的资源。<br>可以换个关键词，或者让 AI 基于本课生词直接生成一份。<div style="margin-top:10px"><button class="btn sm red" data-goto2="gen">用 AI 生成</button></div></div>`;
  }
  $("#libList").addEventListener("click", (e) => {
    if (e.target.closest("[data-res]")) toast("已加入“第 8 课 购物”课件的素材栏。");
    if (e.target.closest("[data-goto2]")) showScreen("gen");
  });
  $$("#libFilters button").forEach((b) => b.addEventListener("click", () => {
    libSrc = b.dataset.src;
    $$("#libFilters button").forEach((x) => x.classList.toggle("on", x === b));
    renderLib();
  }));
  $("#libGo").addEventListener("click", renderLib);
  $("#libQ").addEventListener("keydown", (e) => { if (e.key === "Enter") renderLib(); });
  screenInit.lib = renderLib;

  /* ================================================================
     Leveling checker (demo lexicon, not official data)
     ================================================================ */
  const LEX_SRC = {
    1: "我 你 您 他 她 它 我们 你们 他们 这 那 哪 这个 那个 哪个 这儿 那儿 哪儿 什么 谁 几 多少 是 有 在 不 没 没有 很 太 也 都 和 的 了 吗 呢 吧 好 你好 谢谢 不客气 再见 对不起 没关系 请 请问 块 元 钱 个 件 本 口 人 中国 中国人 汉语 中文 学 学习 学生 老师 学校 大学 朋友 家 爸爸 妈妈 哥哥 姐姐 弟弟 妹妹 儿子 女儿 吃 喝 茶 水 米饭 饭 饭馆 菜 苹果 买 卖 东西 商店 衣服 贵 大 小 多 少 去 来 回 看 听 说 读 写 想 要 能 会 可以 喜欢 爱 叫 名字 今天 明天 昨天 现在 时候 点 分 年 月 日 号 星期 上午 下午 晚上 天 天气 冷 热 下雨 坐 开 出租车 飞机 火车 站 医院 医生 工作 认识 高兴 怎么 怎么样 里 上 下 前 后 左 右 边 电脑 电视 电影 打电话 睡觉 做 知道 跟 对 给 找 等 用 手机 一点儿 红 白 黑 颜色 大家 两 还 再 先 走 路 远 近 问 欢迎 地方 时间 小时 分钟 早上 中午 杯 杯子 岁 住 一起 非常 真 最 就 好吃 好的 书 字 买东西",
    2: "便宜 当然 就行 红色 白色 黑色 一些 一下 可能 应该 已经 正在 着 过 比 别 告诉 让 帮 帮助 准备 觉得 希望 介绍 地铁 地铁站 公共汽车 一直 往 离 从 到 向 门口 旁边 附近 菜单 服务员 点菜 好吧 鸡蛋 牛奶 面条 鱼 牛肉 饿 渴 试 穿 双 条 漂亮 长 短 合适 一共 碗 路口 别的 东边 西边 南边 北边",
    3: "毛衣 支付 扫 价格 超市 购物 付钱 现金 信用卡 换 退 质量 打折 样子 讲价",
    5: "二维码 讨价还价 款式",
  };
  const LEX = new Map();
  Object.entries(LEX_SRC).forEach(([lv, s]) => s.split(/\s+/).forEach((w) => { if (w && !LEX.has(w)) LEX.set(w, +lv); }));
  const LEX_MAXLEN = 4;
  const NUM_RE = /^[零一二三四五六七八九十百千万两]+$/;
  const SUGGEST = { "毛衣": "衣服（一级）", "支付": "付钱 / 给钱", "扫": "保留，并加注释", "二维码": "时代高频词，建议加入白名单并加注释", "款式": "样子", "讨价还价": "便宜一点儿", "价格": "多少钱" };
  function segment(text) {
    const out = [];
    let i = 0;
    while (i < text.length) {
      const ch = text[i];
      if (!/[\u4e00-\u9fff]/.test(ch)) { out.push({ w: ch, lv: null }); i++; continue; }
      let m = null;
      for (let L = Math.min(LEX_MAXLEN, text.length - i); L >= 1; L--) {
        const w = text.slice(i, i + L);
        if (LEX.has(w)) { m = { w, lv: LEX.get(w) }; break; }
      }
      let j = i;
      while (j < text.length && "零一二三四五六七八九十百千万两".includes(text[j])) j++;
      const numLen = j - i;
      if (numLen && (!m || (numLen >= m.w.length && !(m.w.length > 1 && numLen === 1)))) {
        out.push({ w: text.slice(i, j), lv: 1, num: true }); i = j; continue;
      }
      if (!m) m = { w: ch, lv: 0 };
      out.push(m); i += m.w.length;
    }
    return out;
  }
  function runLevel() {
    const max = +$("#lvMax").value;
    const toks = segment($("#lvIn").value);
    const words = toks.filter((t) => t.lv !== null);
    const hi = [], unk = [];
    $("#lvOut").innerHTML = toks.map((t) => {
      if (t.lv === null) return t.w === "\n" ? "<br>" : esc(t.w);
      if (t.lv === 0) { unk.push(t.w); return `<span class="lv-w lv-unk" title="词表外：需要人工确认">${esc(t.w)}</span>`; }
      if (t.lv > max) { hi.push(t); return `<span class="lv-w lv-hi" title="${t.lv >= 5 ? "高等/中等" : t.lv + " 级"}：超出上限">${esc(t.w)}</span>`; }
      return `<span class="lv-w lv-${Math.min(t.lv, 3)}" title="${t.num ? "数词" : t.lv + " 级"}">${esc(t.w)}</span>`;
    }).join("");
    const uniqHi = [...new Map(hi.map((t) => [t.w, t])).values()];
    const pct = words.length ? Math.round((1 - (hi.length + unk.length) / words.length) * 100) : 100;
    $("#lvStat").innerHTML = words.length ? `
      <div class="row" style="gap:16px;margin-bottom:6px"><div><div class="kpi" style="font-size:22px">${pct}%</div><div class="kpi-label">词次在 ${max} 级以内</div></div>
      <div><div class="kpi" style="font-size:22px;color:${uniqHi.length ? "var(--red)" : "var(--jade)"}">${uniqHi.length}</div><div class="kpi-label">超纲词</div></div>
      <div><div class="kpi" style="font-size:22px">${words.length}</div><div class="kpi-label">词次</div></div></div>
      ${uniqHi.length ? `<table class="t"><tr><th>超纲词</th><th>等级</th><th>建议</th></tr>${uniqHi.map((t) => `<tr><td>${esc(t.w)}</td><td>${t.lv >= 5 ? "中高等" : t.lv + " 级"}</td><td>${esc(SUGGEST[t.w] || "替换为已学词，或作为生词加注释")}</td></tr>`).join("")}</table>` : `<div class="callout jade" style="margin:0">全部在 ${max} 级以内，可以直接使用。</div>`}
      ${unk.length ? `<p class="muted">词表外的字：${[...new Set(unk)].map(esc).join("、")}（演示词表较小，正式版使用全量词表）</p>` : ""}`
      : `<div class="empty">请输入一段中文。</div>`;
  }
  $("#lvGo").addEventListener("click", runLevel);
  $("#lvMax").addEventListener("change", runLevel);
  screenInit.level = runLevel;

  /* ================================================================
     Games
     ================================================================ */
  const GAME_WORDS = [["衣服", "yī fu", "clothes"], ["多少", "duō shao", "how much"], ["便宜", "pián yi", "cheap"], ["贵", "guì", "expensive"], ["颜色", "yán sè", "color"], ["试", "shì", "to try"]];
  let matchMode = "py", matchSel = null, matchDone = 0, matchStart = 0, matchTimer = null, matchFirstAt = 0;
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function setupMatch() {
    clearInterval(matchTimer);
    matchSel = null; matchDone = 0; matchStart = 0;
    const tiles = [];
    GAME_WORDS.forEach((w, k) => {
      tiles.push({ k, html: w[0], cls: "hz" });
      tiles.push({ k, html: matchMode === "py" ? colorPy(w[1]) : esc(w[2]), cls: "" });
    });
    $("#matchBoard").innerHTML = shuffle(tiles).map((t) => `<div class="tile ${t.cls}" data-k="${t.k}" data-side="${t.cls ? "hz" : "x"}">${t.html}</div>`).join("");
    $("#matchInfo").textContent = "用时 0 秒 · 已配对 0 / 6";
  }
  function updateMatchInfo() {
    const sec = matchStart ? Math.round((Date.now() - matchStart) / 1000) : 0;
    $("#matchInfo").textContent = `用时 ${sec} 秒 · 已配对 ${matchDone} / 6`;
  }
  $("#matchBoard").addEventListener("click", (e) => {
    const t = e.target.closest(".tile");
    if (!t || t.classList.contains("gone")) return;
    if (!matchStart) { matchStart = Date.now(); matchTimer = setInterval(updateMatchInfo, 500); }
    if (!matchSel) { matchSel = t; t.classList.add("sel"); return; }
    if (matchSel === t) { t.classList.remove("sel"); matchSel = null; return; }
    const a = matchSel; matchSel = null;
    if (a.dataset.k === t.dataset.k && a.dataset.side !== t.dataset.side) {
      a.classList.remove("sel"); a.classList.add("gone"); t.classList.add("gone");
      matchDone++; updateMatchInfo();
      if (matchDone === 6) {
        clearInterval(matchTimer);
        const sec = Math.round((Date.now() - matchStart) / 1000);
        toast(`全部配对完成，用时 ${sec} 秒！课堂模式下会显示各组排名。`, [{ label: "再玩一次", primary: true, onClick: setupMatch }]);
      }
    } else {
      a.classList.remove("sel");
      [a, t].forEach((x) => { x.classList.remove("wrong"); void x.offsetWidth; x.classList.add("wrong"); });
    }
  });
  $("#matchReset").addEventListener("click", setupMatch);
  $$("#matchMode button").forEach((b) => b.addEventListener("click", () => {
    matchMode = b.dataset.m;
    $$("#matchMode button").forEach((x) => x.classList.toggle("on", x === b));
    setupMatch();
  }));
  $$("#gameSwitch button").forEach((b) => b.addEventListener("click", () => {
    $$("#gameSwitch button").forEach((x) => x.classList.toggle("on", x === b));
    $("#gameMatch").style.display = b.dataset.g === "match" ? "" : "none";
    $("#gameDrum").style.display = b.dataset.g === "drum" ? "" : "none";
  }));
  const NAMES = ["Somchai", "Ploy", "Nattapong", "Kanya", "Arthit", "Mali", "Pim", "Krit", "Fah", "Ton", "Nok", "Beam"];
  const QUESTIONS = [
    "用“便宜一点儿”说一句话。", "“贵”的反义词是什么？", "读一读：<span class='t2'>pián</span><span class='t0'>yi</span>",
    "这件衣服多少钱？请用“……块”回答。", "你喜欢什么颜色？", "“试”是什么意思？请做一个动作。", "说出两件衣服的名字。",
  ];
  $("#drumNames").innerHTML = NAMES.map((n) => `<span>${n}</span>`).join("");
  let drumBusy = false;
  $("#drumGo").addEventListener("click", async () => {
    if (drumBusy) return;
    drumBusy = true; $("#drumGo").disabled = true;
    const spans = $$("#drumNames span");
    $("#drumQ").innerHTML = `<span style="opacity:.7">咚咚咚……花在传……</span>`;
    let idx = Math.floor(Math.random() * spans.length);
    const total = 22 + Math.floor(Math.random() * spans.length);
    for (let i = 0; i < total; i++) {
      spans.forEach((s) => s.classList.remove("hot"));
      idx = (idx + 1) % spans.length;
      spans[idx].classList.add("hot");
      await sleep(60 + i * i * 0.6);
    }
    const q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    $("#drumQ").innerHTML = `花停在 <b style="color:#f2b33d">${NAMES[idx]}</b> 手里！<div style="margin-top:6px;font-size:22px">${q}</div>`;
    drumBusy = false; $("#drumGo").disabled = false;
  });
  screenInit.game = setupMatch;

  /* ================================================================
     Report
     ================================================================ */
  const REPORT = {
    class: { v: [72, 58, 69, 61, 55], lv: "全班估计：初等二级（中位数），二级以上 14 人", err: [["三声发成二声", 41], ["四声降幅不足", 23], ["送气音不足（p/b、t/d）", 14], ["三声变调未执行", 12], ["ü 发成 u", 10]] },
    s1: { v: [80, 52, 74, 66, 48], lv: "Somchai：初等二级（参考，置信区间 1.6–2.4 级）", err: [["三声发成二声", 52], ["送气音不足（p/b、t/d）", 21], ["四声降幅不足", 15], ["三声变调未执行", 8], ["ü 发成 u", 4]] },
    s2: { v: [86, 78, 82, 75, 70], lv: "Ploy：初等三级（参考，置信区间 2.6–3.3 级）", err: [["四声降幅不足", 33], ["三声发成二声", 25], ["ü 发成 u", 20], ["三声变调未执行", 12], ["送气音不足（p/b、t/d）", 10]] },
    s3: { v: [60, 45, 58, 50, 62], lv: "Nattapong：初等一级（参考，置信区间 0.9–1.7 级）", err: [["三声发成二声", 47], ["三声变调未执行", 22], ["四声降幅不足", 17], ["送气音不足（p/b、t/d）", 9], ["ü 发成 u", 5]] },
  };
  const COMMENTS = {
    class: "本周全班作业完成率 87%。听力和阅读整体达到二级水平；口语主要问题集中在三声（常发成二声）和四声降不下来，下节课复习页已加入二字组声调操练。汉字“爱”“我”的笔顺错误较多，已推送描红作业。",
    s1: "Somchai 听力和阅读进步明显。口语中三声常发成二声，建议每天跟读“你好、很好、可以”等变调词 5 分钟。汉字书写需要加强，注意“爱”的笔顺。",
    s2: "Ploy 各项能力均衡，口语流利度在班里名列前茅。四声有时降得不够，可以在句末四声词（如“对、是、去”）上多练习。",
    s3: "Nattapong 学习态度认真，书写进步明显。口语和听力需要更多输入，建议课后每天听课文录音两遍，并完成声调跟读作业。",
  };
  function renderReport() {
    const key = $("#repStu").value, R = REPORT[key];
    const axes = ["听", "说", "读", "写", "汉字"], cx = 150, cy = 130, rad = 95;
    const pt = (i, r) => [cx + r * Math.sin((2 * Math.PI * i) / 5), cy - r * Math.cos((2 * Math.PI * i) / 5)];
    let svg = "";
    [0.25, 0.5, 0.75, 1].forEach((f) => { svg += `<polygon points="${axes.map((_, i) => pt(i, rad * f).join(",")).join(" ")}" fill="none" stroke="#e6e1d8"/>`; });
    axes.forEach((a, i) => { const [x, y] = pt(i, rad); svg += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#e6e1d8"/>`; const [lx, ly] = pt(i, rad + 16); svg += `<text x="${lx}" y="${ly + 4}" text-anchor="middle">${a} ${R.v[i]}</text>`; });
    svg += `<polygon points="${R.v.map((v, i) => pt(i, (rad * v) / 100).join(",")).join(" ")}" fill="rgba(200,67,43,.18)" stroke="#c8432b" stroke-width="2"/>`;
    $("#radar").innerHTML = svg;
    $("#repLevel").textContent = R.lv;
    $("#repErr").innerHTML = R.err.map((e) => `<div style="margin:6px 0"><div class="row small" style="justify-content:space-between"><span>${e[0]}</span><b>${e[1]}%</b></div><div class="bar"><i style="width:${e[1]}%"></i></div></div>`).join("") + `<p class="small muted" style="margin-top:6px">12 段录音置信度较低，未计入统计，等待你复核。</p>`;
    $("#repComment").value = COMMENTS[key];
  }
  $("#repStu").addEventListener("change", renderReport);
  screenInit.report = renderReport;

  /* ================================================================
     Tone demo
     ================================================================ */
  const TONE_TARGETS = [
    { id: "ma1", hz: "妈", py: "mā", syl: [1], note: "一声：在自己音域的高处，平稳不降" },
    { id: "ma2", hz: "麻", py: "má", syl: [2], note: "二声：从中间往上升，像疑问的“嗯？”" },
    { id: "ma3", hz: "马", py: "mǎ", syl: [3], note: "三声：先降到最低，单念时再升上来" },
    { id: "ma4", hz: "骂", py: "mà", syl: [4], note: "四声：从最高处快速降到最低" },
    { id: "nihao", hz: "你好", py: "nǐ hǎo", syl: [2, 3], note: "三声 + 三声：前一个读成二声，实际读 ní hǎo" },
    { id: "zhongguo", hz: "中国", py: "zhōng guó", syl: [1, 2], note: "一声 + 二声：第一个要够高" },
    { id: "xiexie", hz: "谢谢", py: "xiè xie", syl: [4, 0], note: "第二个“谢”读轻声：短、轻，在四声后偏低" },
    { id: "laoshi", hz: "老师", py: "lǎo shī", syl: ["3h", 1], note: "三声在一声前读半三声：只降不升" },
  ];
  const TPL = {
    1: [4.9, 5, 5, 5, 5, 5, 5, 5, 4.95, 4.9],
    2: [3, 2.95, 3.05, 3.2, 3.45, 3.75, 4.1, 4.45, 4.75, 5],
    3: [2.3, 1.9, 1.5, 1.2, 1.05, 1.1, 1.5, 2.3, 3.2, 4],
    "3h": [2.4, 2.1, 1.8, 1.5, 1.3, 1.15, 1.05, 1, 1, 1],
    4: [5, 4.95, 4.7, 4.3, 3.8, 3.2, 2.6, 2, 1.45, 1.05],
    0: [2.2, 2, 1.85, 1.75, 1.7, 1.65, 1.6, 1.6, 1.55, 1.5],
  };
  const TONE_NAME = { 1: "一声", 2: "二声", 3: "三声", "3h": "半三声", 4: "四声", 0: "轻声", flat: "平调" };
  const SIM_ERR = {
    ma1: [{ shape: [5, 5, 5, 4.9, 4.7, 4.4, 4, 3.5, 3, 2.6] }],
    ma2: [{ shape: [3.4, 3.1, 2.7, 2.3, 2, 2.1, 2.6, 3.3, 4, 4.4] }],
    ma3: [{ shape: [2.8, 2.8, 2.9, 3.1, 3.4, 3.7, 4, 4.3, 4.6, 4.8] }],
    ma4: [{ shape: [4.6, 4.6, 4.5, 4.3, 4.1, 3.9, 3.7, 3.5, 3.3, 3.2] }],
    nihao: [{ shape: TPL["3h"] }, { shape: TPL[3] }],
    zhongguo: [{ shape: [3.1, 3.1, 3.05, 3, 3, 3, 3, 2.95, 2.9, 2.9] }, { shape: TPL[2] }],
    xiexie: [{ shape: TPL[4] }, { shape: TPL[4], dur: 1 }],
    laoshi: [{ shape: TPL[3] }, { shape: TPL[1] }],
  };
  const SIM_ERR_LABEL = { ma1: "一声尾部下滑", ma2: "二声先降后升，像三声", ma3: "三声发成二声", ma4: "四声降幅不足", nihao: "没有执行三声变调", zhongguo: "一声偏低", xiexie: "轻声读重了", laoshi: "半三声升上去了" };

  let toneTarget = TONE_TARGETS[2];
  const session = { st: [], recs: 0 };
  let simFlip = false;
  let lastAudioUrl = null;

  $("#toneTargets").innerHTML = TONE_TARGETS.map((t) => `<button class="btn sm ${t === toneTarget ? "on" : ""}" data-id="${t.id}">${t.hz} <span class="muted" style="font-size:11px">${t.py}</span></button>`).join("");
  function selectTarget(id) {
    toneTarget = TONE_TARGETS.find((t) => t.id === id);
    $$("#toneTargets button").forEach((b) => b.classList.toggle("on", b.dataset.id === id));
    $("#toneHz").textContent = toneTarget.hz;
    $("#tonePy").innerHTML = colorPy(toneTarget.py, " ");
    $("#toneNote").textContent = toneTarget.note;
    $("#toneCards").innerHTML = "";
    drawTone(null);
  }
  $("#toneTargets").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) selectTarget(b.dataset.id); });

  const st = (f) => 12 * Math.log2(f / 100);
  const median = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
  const pctl = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.max(0, Math.floor(p * (s.length - 1))))]; };
  const mean = (a) => a.reduce((x, y) => x + y, 0) / (a.length || 1);
  function resample(arr, n) {
    if (arr.length === 1) return Array(n).fill(arr[0]);
    return Array.from({ length: n }, (_, i) => {
      const x = (i * (arr.length - 1)) / (n - 1), a = Math.floor(x), b = Math.min(arr.length - 1, a + 1);
      return arr[a] + (arr[b] - arr[a]) * (x - a);
    });
  }

  function yin(buf, sr) {
    const maxTau = Math.min(Math.floor(sr / 70), buf.length >> 1), minTau = Math.floor(sr / 450), W = buf.length - maxTau;
    const d = new Float32Array(maxTau + 1);
    for (let tau = 1; tau <= maxTau; tau++) {
      let s = 0;
      for (let i = 0; i < W; i++) { const x = buf[i] - buf[i + tau]; s += x * x; }
      d[tau] = s;
    }
    const c = new Float32Array(maxTau + 1); c[0] = 1;
    let run = 0;
    for (let tau = 1; tau <= maxTau; tau++) { run += d[tau]; c[tau] = run ? (d[tau] * tau) / run : 1; }
    let tau = -1;
    for (let t = minTau; t <= maxTau; t++) {
      if (c[t] < 0.15) { while (t + 1 <= maxTau && c[t + 1] < c[t]) t++; tau = t; break; }
    }
    if (tau < 2) return -1;
    const x0 = c[tau - 1], x1 = c[tau], x2 = tau + 1 <= maxTau ? c[tau + 1] : c[tau];
    const den = x0 + x2 - 2 * x1;
    return sr / (tau + (den ? (x0 - x2) / (2 * den) : 0));
  }

  function analyze(frames, nSyl, calib) {
    let voiced = frames.map((f) => (f.f0 > 0 ? st(f.f0) : null));
    const vals = voiced.filter((v) => v !== null);
    if (vals.length < 6) return { error: "没有检测到清晰的声音。请靠近麦克风、在安静环境中再读一次。" };
    // Octave errors are brief jumps of ~12 st; legitimate tone contours move gradually, so compare locally.
    voiced = voiced.map((v, i) => {
      if (v === null) return null;
      const near = voiced.slice(Math.max(0, i - 5), i + 6).filter((x) => x !== null);
      return Math.abs(v - median(near)) > 7 ? null : v;
    });
    voiced = voiced.map((v, i) => {
      if (v === null) return null;
      const win = voiced.slice(Math.max(0, i - 2), i + 3).filter((x) => x !== null);
      return median(win);
    });
    let runs = [], cur = null, gap = 0;
    voiced.forEach((v, i) => {
      if (v !== null) { if (!cur) cur = { s: i, e: i }; cur.e = i; gap = 0; }
      else if (cur) { gap++; if (gap >= 3) { runs.push(cur); cur = null; gap = 0; } }
    });
    if (cur) runs.push(cur);
    runs = runs.filter((r) => r.e - r.s >= 3);
    if (!runs.length) return { error: "录音太短，请把字读完整、稍微拉长一点。" };
    while (runs.length > nSyl) {
      let bi = 0, bg = Infinity;
      for (let i = 0; i < runs.length - 1; i++) { const g = runs[i + 1].s - runs[i].e; if (g < bg) { bg = g; bi = i; } }
      runs.splice(bi, 2, { s: runs[bi].s, e: runs[bi + 1].e });
    }
    while (runs.length < nSyl) {
      let li = 0;
      runs.forEach((r, i) => { if (r.e - r.s > runs[li].e - runs[li].s) li = i; });
      const r = runs[li], mid = Math.floor((r.s + r.e) / 2);
      runs.splice(li, 1, { s: r.s, e: mid }, { s: mid + 1, e: r.e });
    }
    const allSt = runs.flatMap((r) => voiced.slice(r.s, r.e + 1).filter((v) => v !== null));
    let lo, hi, calibrated = false;
    if (calib) { lo = calib.lo; hi = calib.hi; calibrated = true; }
    else if (session.recs >= 3 && session.st.length > 80) { lo = pctl(session.st, 0.05); hi = pctl(session.st, 0.95); calibrated = true; }
    else { lo = pctl(allSt, 0.03); hi = pctl(allSt, 0.97); }
    if (hi - lo < 8) { const c = (hi + lo) / 2; lo = c - 4; hi = c + 4; }
    if (!calib) { session.st.push(...allSt); if (session.st.length > 3000) session.st.splice(0, session.st.length - 3000); }
    const lvl = (v) => Math.max(0.6, Math.min(5.4, 1 + (4 * (v - lo)) / (hi - lo)));
    const syls = runs.map((r) => {
      const seg = voiced.slice(r.s, r.e + 1).filter((v) => v !== null);
      const trim = Math.floor(seg.length * 0.12);
      const core = seg.length > 8 ? seg.slice(trim, seg.length - trim) : seg;
      return { pts: resample(core.map(lvl), 10), dur: r.e - r.s + 1 };
    });
    return { syls, calibrated };
  }

  function classify(p) {
    const start = (p[0] + p[1]) / 2, end = (p[8] + p[9]) / 2;
    let min = Infinity, minIdx = 0, max = -Infinity;
    p.forEach((v, i) => { if (v < min) { min = v; minIdx = i; } if (v > max) max = v; });
    const range = max - min, m = mean(p), d = end - start, minPos = minIdx / 9;
    let cls, conf;
    if (range < 0.7) { cls = m <= 2.1 ? "3h" : 1; conf = 0.9 - range * 0.3; }
    else if (minPos >= 0.2 && minPos <= 0.8 && start - min >= 0.5 && end - min >= 0.8) { cls = 3; conf = Math.min(0.95, 0.6 + Math.min(start - min, end - min) * 0.2); }
    else if (d >= 0.8) { cls = 2; conf = Math.min(0.95, 0.55 + d * 0.15); }
    else if (d <= -0.8) { cls = start <= 3 && end <= 1.8 ? "3h" : 4; conf = Math.min(0.95, 0.55 - d * 0.12); }
    else { cls = m >= 3 ? 1 : "3h"; conf = 0.5; }
    return { cls, conf, start, end, mean: m, range };
  }

  const FB = {
    "1-4": "一声的结尾往下掉了，听起来像四声。保持高而平，像唱歌时拉长音“啊——”。",
    "1-2": "一声起点偏低、整体在往上走。一开始就放在自己声音的高处，然后保持不动。",
    "1-3": "一声不应该有下降再上升的弯。整个音保持在高处。",
    "1-3h": "一声太低了，听起来像半三声。把声音提到自己音域的高处。",
    "2-3": "二声先往下沉了一段再升，容易听成三声。从中间直接往上升，不要先降。",
    "2-4": "二声应该是往上升，你读成了下降。想象问别人“嗯？”的语气。",
    "2-1": "二声升得不够明显，听起来像一声。从中间开始，结尾明显升高。",
    "2-3h": "二声读成了低降调。从中间往上升，结尾要高。",
    "3-2": "三声发成了二声：这是最常见的错误之一。先把声音压到最低处，再轻轻上扬；语流中多数时候只要“低下去”就够了。",
    "3-4": "三声起点太高、读成了四声。三声的起点在中低位置，重点是“低”。",
    "3-1": "三声读平了。注意先往下压到最低。",
    "3h-3": "单念时没问题；但在一声前面应读半三声，降到最低就停，不用再升上去。",
    "3h-2": "这里应该是低降的半三声，你读成了上升。只降不升。",
    "3h-1": "半三声应该是低的，你读得太高太平了。",
    "3h-4": "半三声起点太高，听起来像四声。从中低处往下降一点就够了。",
    "4-1": "四声降得不够，听起来像一声。从最高处快速降到最低，像生气地说“不！”",
    "4-2": "四声应该下降，你读成了上升。从最高处往下“砸”。",
    "4-3": "四声中间不应该再升上去，一口气降到底。",
    "4-3h": "四声起点不够高。先提到最高再降。",
  };

  function judge(target, res) {
    const out = [];
    res.syls.forEach((s, i) => {
      const exp = target.syl[i];
      const c = classify(s.pts);
      let status = "ok", msg = "", detected = c.cls;
      if (exp === 0) {
        const prev = res.syls[i - 1];
        const short = prev ? s.dur <= prev.dur * 0.8 : true;
        const low = prev ? c.mean <= mean(prev.pts.slice(6)) + 0.6 : true;
        detected = short && low ? 0 : c.cls;
        if (short && low) msg = "轻声读得很好：短而轻。";
        else { status = "bad"; msg = "轻声读重了：第二个音节应该更短、更轻，不要读成完整的" + TONE_NAME[c.cls] + "。"; }
      } else {
        const match = exp === c.cls || (exp === 3 && c.cls === "3h");
        if (match) {
          msg = "调型正确。";
          if (exp === 3 && c.cls === "3h") msg = "可以接受（半三声）。单念时可以在结尾再往上升一点。";
          if (exp === 1 && res.calibrated && c.mean < 3.8) { status = "unsure"; msg = "调型是平的，但整体偏低。一声要放在自己音域的高处。"; }
          if (exp === 4 && c.end > 2.6) { status = "bad"; msg = FB["4-1"].replace("听起来像一声。", "结尾还停在中间。"); detected = 4; }
        } else if (exp === "3h" && c.cls === 3) { status = "unsure"; msg = FB["3h-3"]; }
        else if (exp === 2 && i === 0 && target.syl[1] === 3 && (c.cls === 3 || c.cls === "3h")) { status = "bad"; msg = "没有执行三声变调：“你好”的“你”应该读成二声 ní，往上扬。"; }
        else { status = "bad"; msg = FB[`${exp}-${c.cls}`] || `目标是${TONE_NAME[exp]}，听起来像${TONE_NAME[c.cls]}。`; }
      }
      if (status === "bad" && c.conf < 0.6 && exp !== 0) { status = "unsure"; msg = "不太确定，建议再听一遍标准音后重读。（置信度低时系统不判错）"; }
      out.push({ exp, detected, status, msg, conf: c.conf, pts: s.pts, dur: s.dur });
    });
    return out;
  }

  function drawTone(result) {
    const svg = $("#toneSvg"), W = 640, H = 230, L = 40, R = 14, T = 16, B = 34;
    const y = (v) => T + ((5 - v) / 4) * (H - T - B);
    let g = "";
    for (let v = 1; v <= 5; v++) g += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="${v === 3 ? "#e6e1d8" : "#f0ece4"}"/><text x="${L - 12}" y="${y(v) + 4}" font-size="11" fill="#8a8f9c" text-anchor="middle">${v}</text>`;
    const n = toneTarget.syl.length;
    const weights = toneTarget.syl.map((t) => (t === 0 ? 0.55 : 1));
    const totalW = W - L - R - (n - 1) * 26, sumW = weights.reduce((a, b) => a + b, 0);
    let x0 = L + 6;
    const hzChars = [...toneTarget.hz];
    const pyParts = toneTarget.py.split(" ");
    toneTarget.syl.forEach((t, i) => {
      const w = (totalW * weights[i]) / sumW - 12;
      const pts = (k, arr) => arr.map((v, j) => `${x0 + (j / (arr.length - 1)) * w},${y(v)}`).join(" ");
      g += `<polyline points="${pts(0, TPL[t])}" fill="none" stroke="#9aa0ad" stroke-width="2.5" stroke-dasharray="6 5" stroke-linecap="round"/>`;
      if (result && result[i]) {
        const r = result[i];
        const col = r.status === "ok" ? "#24857a" : r.status === "bad" ? "#c8432b" : "#b7862c";
        g += `<polyline points="${pts(0, r.pts)}" fill="none" stroke="${col}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
        r.pts.forEach((v, j) => { if (j % 3 === 0) g += `<circle cx="${x0 + (j / 9) * w}" cy="${y(v)}" r="3" fill="${col}"/>`; });
      }
      g += `<text x="${x0 + w / 2}" y="${H - 10}" text-anchor="middle" font-size="15" fill="#1d2433" font-family="serif">${hzChars[i] || ""} <tspan font-size="12" fill="#6b7387">${pyParts[i] || ""} · ${TONE_NAME[t]}</tspan></text>`;
      x0 += w + 38;
    });
    svg.innerHTML = g;
  }

  function showResult(res, note) {
    if (res.error) { $("#toneMsg").innerHTML = `<span style="color:var(--red)">${res.error}</span>`; return; }
    const r = judge(toneTarget, res);
    drawTone(r);
    $("#calibInfo").textContent = res.calibrated ? "音域校准：已生效" : `音域校准：已采集 ${session.recs} 段（3 段后生效）`;
    const allOk = r.every((x) => x.status === "ok");
    $("#toneMsg").innerHTML = (note ? `<b>${note}</b>　` : "") + (allOk ? `<span style="color:var(--jade)">读得很好！可以试试下一个词。</span>` : "看下面每个音节的诊断，先听标准音，再对照曲线重读。");
    $("#toneCards").innerHTML = r.map((x, i) => `
      <div class="syl-card ${x.status}">
        <div class="row" style="justify-content:space-between"><b style="font-family:var(--serif);font-size:20px">${[...toneTarget.hz][i]}</b>
          <span class="chip ${x.status === "ok" ? "jade" : x.status === "bad" ? "red" : "gold"}">${x.status === "ok" ? "正确" : x.status === "bad" ? "需要纠正" : "待确认"}</span></div>
        <div class="small muted">目标：${TONE_NAME[x.exp]}　识别：${TONE_NAME[x.detected] || "—"}</div>
        <div class="small" style="margin-top:4px">${x.msg}</div>
        <div class="small muted" style="margin-top:4px">置信度 ${Math.round(x.conf * 100)}%</div><div class="meter"><i style="width:${Math.round(x.conf * 100)}%"></i></div>
      </div>`).join("");
  }

  function simulate() {
    const t = toneTarget;
    simFlip = !simFlip;
    const wrong = simFlip;
    const frames = [];
    const base = 150, span = 10;
    const plan = t.syl.map((tone, i) => (wrong ? SIM_ERR[t.id][i] || { shape: TPL[tone] } : { shape: TPL[tone], dur: tone === 0 ? 0.5 : 1 }));
    plan.forEach((p, i) => {
      if (i > 0) for (let k = 0; k < 6; k++) frames.push({ f0: -1 });
      const n = Math.round(28 * (p.dur || 1));
      const curve = resample(p.shape, n);
      curve.forEach((lv) => {
        const s = ((lv - 1) / 4) * span + (Math.random() - 0.5) * 0.35;
        frames.push({ f0: base * Math.pow(2, s / 12) });
      });
    });
    const res = analyze(frames, t.syl.length, { lo: st(base), hi: st(base) + span });
    res.calibrated = true;
    showResult(res, wrong ? `模拟：一位学习者的录音（典型错误：${SIM_ERR_LABEL[t.id]}）` : "模拟：一段正确的录音");
  }
  $("#simBtn").addEventListener("click", simulate);

  $("#playStd").addEventListener("click", () => {
    if (!("speechSynthesis" in window)) { toast("当前浏览器不支持语音合成。生产版使用专门录制或 TTS 生成的慢速标准音。"); return; }
    const u = new SpeechSynthesisUtterance(toneTarget.hz);
    u.lang = "zh-CN"; u.rate = 0.6;
    const v = speechSynthesis.getVoices().find((x) => /zh[-_]CN/i.test(x.lang));
    if (v) u.voice = v;
    else toast("没有找到中文语音包，播放效果可能不准确。生产版使用专门的教学音色。");
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  });
  $("#playMine").addEventListener("click", () => { if (lastAudioUrl) new Audio(lastAudioUrl).play(); });

  let recording = false;
  $("#recBtn").addEventListener("click", async () => {
    if (recording) return;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast("当前环境无法使用麦克风（需要 https 或本地打开）。可以点“模拟一段学习者录音”体验。");
      return;
    }
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
    } catch (err) {
      toast("没有获得麦克风权限。可以在浏览器地址栏允许麦克风，或点“模拟一段学习者录音”体验。");
      return;
    }
    recording = true;
    const btn = $("#recBtn");
    btn.classList.add("rec"); btn.innerHTML = "正在<br>录音";
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    const src = ctx.createMediaStreamSource(stream);
    const an = ctx.createAnalyser(); an.fftSize = 2048;
    src.connect(an);
    const buf = new Float32Array(an.fftSize);
    let chunks = [], mr = null;
    if (window.MediaRecorder) { try { mr = new MediaRecorder(stream); mr.ondataavailable = (e) => chunks.push(e.data); mr.start(); } catch (e) { mr = null; } }
    const frames = [];
    const dur = toneTarget.syl.length > 1 ? 2600 : 2000;
    const t0 = performance.now();
    $("#toneMsg").textContent = "请开始读……";
    await new Promise((resolve) => {
      const tick = () => {
        an.getFloatTimeDomainData(buf);
        let rms = 0; for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
        rms = Math.sqrt(rms / buf.length);
        frames.push({ f0: rms > 0.01 ? yin(buf, ctx.sampleRate) : -1, rms });
        if (performance.now() - t0 < dur) requestAnimationFrame(tick); else resolve();
      };
      tick();
    });
    if (mr) {
      await new Promise((r) => { mr.onstop = r; mr.stop(); });
      if (lastAudioUrl) URL.revokeObjectURL(lastAudioUrl);
      lastAudioUrl = URL.createObjectURL(new Blob(chunks, { type: mr.mimeType || "audio/webm" }));
      $("#playMine").disabled = false;
    }
    stream.getTracks().forEach((t) => t.stop());
    ctx.close();
    btn.classList.remove("rec"); btn.innerHTML = "按下<br>录音";
    recording = false;
    const res = analyze(frames, toneTarget.syl.length, null);
    if (!res.error) session.recs++;
    showResult(res, "");
  });
  screenInit.tone = () => selectTarget(toneTarget.id);

  /* ================================================================
     Hanzi writing
     ================================================================ */
  const HZ_LIST = ["永", "人", "大", "中", "国", "你", "好", "我", "爱", "学", "水", "火", "山"].filter((c) => window.HANZI_DATA && window.HANZI_DATA[c]);
  let hzChar = "爱", writer = null, lefty = false, outline = true;
  function hzSize() { return $("#hzBoard").clientWidth || 300; }
  function renderSteps(c) {
    const d = window.HANZI_DATA[c];
    $("#hzCount").textContent = `（共 ${d.strokes.length} 笔）`;
    $("#hzSteps").innerHTML = d.strokes.map((_, i) => `<svg viewBox="0 0 1024 1024"><g transform="translate(0, 900) scale(1, -1)">${d.strokes.map((p, j) => j <= i ? `<path d="${p}" fill="${j === i ? "#c8432b" : "#1d2433"}"/>` : `<path d="${p}" fill="#eee9e0"/>`).join("")}</g></svg>`).join("");
  }
  function hzFb(msg, cls = "") { const el = $("#hzFb"); el.className = "hz-feedback " + cls; el.innerHTML = msg; }
  function initWriter() {
    if (!window.HanziWriter) { hzFb("笔顺组件加载失败。", "bad"); return; }
    $("#hzChars").innerHTML = HZ_LIST.map((c) => `<button class="btn ${c === hzChar ? "on" : ""}" data-c="${c}">${c}</button>`).join("");
    const size = hzSize();
    writer = HanziWriter.create("hzBoard", hzChar, {
      width: size, height: size, padding: 18, showOutline: true, strokeAnimationSpeed: 1.1, delayBetweenStrokes: 260,
      strokeColor: "#1d2433", radicalColor: "#c8432b", outlineColor: "#e8e1d6", drawingColor: "#2f5fb3", drawingWidth: 22,
      highlightColor: "#24857a", showHintAfterMisses: 2,
      charDataLoader: (c, done) => done(window.HANZI_DATA[c]),
    });
    renderSteps(hzChar);
    updateHandTip();
  }
  function setChar(c) {
    hzChar = c;
    $$("#hzChars button").forEach((b) => b.classList.toggle("on", b.dataset.c === c));
    writer.setCharacter(c);
    if (!outline) writer.hideOutline();
    renderSteps(c);
    hzFb("先看笔顺动画，再点“开始描写”。红色部分是部首。");
  }
  $("#hzChars").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) setChar(b.dataset.c); });
  $("#hzAnim").addEventListener("click", () => { writer && writer.animateCharacter(); hzFb("观察每一笔的起笔位置和方向。"); });
  $("#hzQuiz").addEventListener("click", () => {
    if (!writer) return;
    const total = window.HANZI_DATA[hzChar].strokes.length;
    hzFb(`请在格子里按笔顺写第 1 笔（共 ${total} 笔）。${lefty ? "左手模式：判定更关注起止点和走向。" : ""}`);
    writer.quiz({
      leniency: lefty ? 1.35 : 1,
      onMistake: (s) => hzFb(`第 ${s.strokeNum + 1} 笔不对：注意起笔位置和书写方向。${s.mistakesOnStroke >= 2 ? "已显示提示。" : ""}`, "bad"),
      onCorrectStroke: (s) => hzFb(s.strokesRemaining ? `第 ${s.strokeNum + 1} 笔正确，继续写第 ${s.strokeNum + 2} 笔。` : "最后一笔正确！", "good"),
      onComplete: (s) => hzFb(s.totalMistakes === 0 ? `完成！“${hzChar}”全部笔顺正确。` : `完成！共出错 ${s.totalMistakes} 次。出错的笔画会加入你的复习卡片。`, s.totalMistakes ? "" : "good"),
    });
  });
  $("#hzOutline").addEventListener("click", () => {
    if (!writer) return;
    outline = !outline;
    outline ? writer.showOutline() : writer.hideOutline();
    $("#hzOutline").textContent = outline ? "隐藏轮廓（默写）" : "显示轮廓（描红）";
  });
  function updateHandTip() {
    $("#hzWrap").classList.toggle("lefty", lefty);
    $("#hzHandTip").innerHTML = lefty
      ? "<b>左手模式</b>：参考区移到书写格右侧，避免被左手遮挡；判定容差提高，更关注起止点和走向。<br>姿势建议：纸张向右倾斜约 20–30°，手腕放在书写行下方，避免“勾手”。规范笔顺不变。"
      : "<b>右手模式</b>：参考区在书写格左侧，避免被右手遮挡。";
  }
  $$("#handSwitch button").forEach((b) => b.addEventListener("click", () => {
    lefty = b.dataset.h === "left";
    $$("#handSwitch button").forEach((x) => x.classList.toggle("on", x === b));
    updateHandTip();
    hzFb(lefty ? "已切换到左手模式。点“开始描写”试试。" : "已切换到右手模式。");
  }));
  screenInit.write = initWriter;

  /* initial */
  selectTarget(toneTarget.id);
  screenInit.tone = null;
})();
